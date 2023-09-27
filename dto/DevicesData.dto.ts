// Data transfer object (dto) definition for dataset validation. 

import {
  IsString,
  Length,
  IsNotEmpty,
  IsPositive,
  IsBoolean,
  IsNegative,
  Min,
  Max,
  IsOptional,
  IsRFC3339,
} from "class-validator";

// Actual model.
export class DevicesDataDTO {
  @IsString({ message: "deviceId must be a string" })
  @Length(6, 10, { message: "deviceId must be between 6 and 10 characters" })
  @IsNotEmpty({ message: "deviceId cannot be empty" })
  deviceId: string;

  timestamp: Date;

  @IsOptional()
  temp1?: number;

  @IsOptional()
  temp2?: number;

  @IsOptional()
  @IsPositive({ message: "humidity must be positive" })
  humidity?: number;

  @IsOptional()
  @IsBoolean({ message: "presence must be a boolean" })
  presence?: boolean;

  @IsOptional()
  @IsNegative({ message: "rssi must be negative" })
  @Min(-100, { message: "rssi must be bigger -100" })
  @Max(0, { message: "rssi must be lower 0" })
  rssi?: number;

  @IsOptional()
  @IsPositive({ message: "uptime must be positive" })
  uptime?: number;
}
