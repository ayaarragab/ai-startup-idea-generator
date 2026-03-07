import db from '../models/index.js';

const { Sector } = db;

export const fetchSectors = async () => {
  try {
    const sectors = await Sector.findAll(
      {
        where: {
          is_deleted: false
        }
      }
    );
    return Array.isArray(sectors) ? sectors.map((sector) => sector.toJSON()) : [];
  } catch (error) {
    throw error;
  }
}