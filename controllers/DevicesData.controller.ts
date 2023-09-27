//controllers for Database manipulations

import { AppDataSource } from "../configs/connection";
import { DevicesDataDTO } from "../dto/DevicesData.dto";
import { DevicesData } from "../entity/DevicesData.entity";

const devicesDataRepository = AppDataSource.getRepository(DevicesData);

// insert a single device data
export const insertDeviceData = async (input: DevicesDataDTO) => {
  try {
    return await devicesDataRepository.insert(input);
  } catch (error) {
    return error;
  }
};

// get a single device data by id
export const getDeviceData = async (findId: number) => {
  try {
    return devicesDataRepository.findOneBy({ id: findId });
  } catch (error) {
    return error;
  }
};

// get all the devices data
export const getAllDevicesData = async () => {
  try {
    return await devicesDataRepository.find();
  } catch (error) {
    return error;
  }
};

// delete a single device data by id
export const deleteDeviceData = async (deleteId: number) => {
  try {
    return await devicesDataRepository.delete({ id: deleteId });
  } catch (error) {
    return error;
  }
};

// truncate the tabl
export const deleteAllDeviceData = async () => {
  try {
    return await devicesDataRepository.clear();
  } catch (error) {
    return error;
  }
};
