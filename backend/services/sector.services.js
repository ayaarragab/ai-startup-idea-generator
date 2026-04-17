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
      return res.status(200).json([]);
    }

    const sectors = await Promise.all(
      convSectors.map((sectorId) => fetchSector(sectorId))
    );

    return sectors;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error while retrieving sector' });
  }
}