import { query } from '../lib/db';
import { State, City, Locality } from '../types/db';

export interface ILocationRepository {
  getAllStates(): Promise<State[]>;
  getAllCities(): Promise<City[]>;
  getAllLocalities(): Promise<(Locality & { city: City })[]>;
  getCityBySlug(slug: string): Promise<(City & { state: State; localities: Locality[] }) | null>;
  getLocalityBySlug(slug: string): Promise<(Locality & { city: City & { state: State } }) | null>;
}

export class LocationRepository implements ILocationRepository {
  async getAllStates(): Promise<State[]> {
    const res = await query<State>('SELECT * FROM states ORDER BY name ASC');
    return res.rows;
  }

  async getAllCities(): Promise<City[]> {
    const res = await query<City>('SELECT * FROM cities ORDER BY name ASC');
    return res.rows;
  }

  async getAllLocalities(): Promise<(Locality & { city: City })[]> {
    const sql = `
      SELECT 
        l.id, l.name, l.slug, l.city_id, l.created_at, l.updated_at,
        c.name as city_name, c.slug as city_slug, c.state_id as city_state_id,
        c.created_at as city_created_at, c.updated_at as city_updated_at
      FROM localities l
      JOIN cities c ON l.city_id = c.id
      ORDER BY l.name ASC
    `;
    const res = await query(sql);
    
    return res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      city_id: row.city_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      city: {
        id: row.city_id,
        name: row.city_name,
        slug: row.city_slug,
        state_id: row.city_state_id,
        created_at: row.city_created_at,
        updated_at: row.city_updated_at,
      },
    }));
  }

  async getCityBySlug(slug: string): Promise<(City & { state: State; localities: Locality[] }) | null> {
    // 1. Fetch city and its state
    const citySql = `
      SELECT 
        c.*,
        s.name as state_name, s.slug as state_slug,
        s.created_at as state_created_at, s.updated_at as state_updated_at
      FROM cities c
      JOIN states s ON c.state_id = s.id
      WHERE c.slug = $1
    `;
    const cityRes = await query(citySql, [slug.toLowerCase()]);
    
    if (cityRes.rowCount === 0) {
      return null;
    }

    const cityRow = cityRes.rows[0];

    // 2. Fetch localities in the city
    const locRes = await query<Locality>('SELECT * FROM localities WHERE city_id = $1', [cityRow.id]);

    return {
      id: cityRow.id,
      name: cityRow.name,
      slug: cityRow.slug,
      state_id: cityRow.state_id,
      created_at: cityRow.created_at,
      updated_at: cityRow.updated_at,
      state: {
        id: cityRow.state_id,
        name: cityRow.state_name,
        slug: cityRow.state_slug,
        created_at: cityRow.state_created_at,
        updated_at: cityRow.state_updated_at,
      },
      localities: locRes.rows,
    };
  }

  async getLocalityBySlug(slug: string): Promise<(Locality & { city: City & { state: State } }) | null> {
    const sql = `
      SELECT 
        l.id as loc_id, l.name as loc_name, l.slug as loc_slug, l.city_id as loc_city_id,
        l.created_at as loc_created_at, l.updated_at as loc_updated_at,
        c.name as city_name, c.slug as city_slug, c.state_id as city_state_id,
        c.created_at as city_created_at, c.updated_at as city_updated_at,
        s.name as state_name, s.slug as state_slug,
        s.created_at as state_created_at, s.updated_at as state_updated_at
      FROM localities l
      JOIN cities c ON l.city_id = c.id
      JOIN states s ON c.state_id = s.id
      WHERE l.slug = $1
    `;
    const res = await query(sql, [slug.toLowerCase()]);
    if (res.rowCount === 0) {
      return null;
    }

    const row = res.rows[0];
    return {
      id: row.loc_id,
      name: row.loc_name,
      slug: row.loc_slug,
      city_id: row.loc_city_id,
      created_at: row.loc_created_at,
      updated_at: row.loc_updated_at,
      city: {
        id: row.loc_city_id,
        name: row.city_name,
        slug: row.city_slug,
        state_id: row.city_state_id,
        created_at: row.city_created_at,
        updated_at: row.city_updated_at,
        state: {
          id: row.city_state_id,
          name: row.state_name,
          slug: row.state_slug,
          created_at: row.state_created_at,
          updated_at: row.state_updated_at,
        },
      },
    };
  }
}
export default LocationRepository;
