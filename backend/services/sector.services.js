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

export const fetchSector = async (id) => {
  try {
    const sector = await Sector.findByPk(id);
    return sector.name;
  } catch (error) {
    throw error;
  }
}

export const fetchSectorsNames = async (convSectors) => {
  try {
    if (!Array.isArray(convSectors) || convSectors.length === 0) {
      return [];
    }

    const sectors = await Promise.all(
      convSectors.map((sectorId) => fetchSector(sectorId))
    );

    return sectors;
  } catch (error) {
    throw error;
  }
}