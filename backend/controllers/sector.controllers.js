import { fetchSectors } from "../services/sector.services.js";

export const getSectors = async (req, res) => {
  try {
    const sectors = await fetchSectors();
    return res.status(200).json(sectors);
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ message: 'Error while retrieving sectors' })
  }
}