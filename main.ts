
let qcarparam = 0
let qcarparam1 = 1
enum PingUnit {
    //% block="cm"
    Centimeters,
}


//% weight=0 color=#00BFFF icon="\uf2c4" block="Qcar"
namespace qcar {


    let _DEBUG: boolean = false
    const debug = (msg: string) => {
        if (_DEBUG === true) {
            serial.writeLine(msg)
        }
    }
    const PinRegDistance = 4
    const channel0OnStepLowByte = 0x06 // LED0_ON_L
    const channel0OnStepHighByte = 0x07 // LED0_ON_H
    const channel0OffStepLowByte = 0x08 // LED0_OFF_L
    const channel0OffStepHighByte = 0x09 // LED0_OFF_H
    const allChannelsOnStepLowByte = 0xFA // ALL_LED_ON_L
    const allChannelsOnStepHighByte = 0xFB // ALL_LED_ON_H
    const allChannelsOffStepLowByte = 0xFC // ALL_LED_OFF_L
    const allChannelsOffStepHighByte = 0xFD // ALL_LED_OFF_H
    const modeRegister1Default = 0x01
    const modeRegister1 = 0x00 // MODE1
    const sleep = modeRegister1Default | 0x10; // Set sleep bit to 1
    const wake = modeRegister1Default & 0xEF; // Set sleep bit to 0
    const restart = wake | 0x80; // Set restart bit to 1
    const PrescaleReg = 0xFE //the prescale register address
    const chipResolution = 4096;
    export enum PinNum {
        Pin0 = 0,
        Pin1 = 1,
        Pin2 = 2,
        Pin3 = 3,
        Pin4 = 4,
        Pin5 = 5,
        Pin6 = 6,
        Pin7 = 7,
        Pin8 = 8,
        Pin9 = 9,
        Pin10 = 10,
        Pin11 = 11,
        Pin12 = 12,
        Pin13 = 13,
        Pin14 = 14,
        Pin15 = 15,
    }
    function write(chipAddress: number, register: number, value: number): void {
        const buffer = pins.createBuffer(2)
        buffer[0] = register
        buffer[1] = value
        pins.i2cWriteBuffer(chipAddress, buffer, false)
    }
    
    




    export enum Patrol {
        //% blockId="patrolLeft" block="left"
        PatrolLeft = 2,
        //% blockId="patrolRight" block="right"
        PatrolRight = 1
    }

    export enum Speed {
        //% blockId="SpeedLeft" block="left"
        LeftSpeed = 20,
        //% blockId="SpeedRight" block="right"
        RightSpeed = 10
    }  
    export enum speedstatus {
        //% blockId="iron" block="on"
        iron = 1,
        //% blockId="iroff" block="off"
        iroff = 2
    }


    export enum Patrol1 {
        //% blockId="patrolLeft" block="left"
        PatrolLeft = 20,
        //% blockId="patrolRight" block="right"
        PatrolRight = 10
    }

    export enum irstatus {
        //% blockId="iron" block="on"
        iron = 1,
        //% blockId="iroff" block="off"
        iroff = 2
    }

    export enum RGBLights {
        //% blockId="Right_RGB" block="Right_RGB"
        RGB_L = 1,
        //% blockId="Left_RGB" block="Left_RGB"
        RGB_R = 0,
        //% blockId="ALL" block="ALL"
        ALL = 3
    }

    export enum Direction {
        //% blockId="Go_Foward" block="Go Foward"
        foward = 1,
        //% blockId="Go_Back" block="Go Back"
        back = 2,
        //% blockId="Turn_Left" block="Turn Left"
        left = 3,
        //% blockId="Turn_Right" block="Turn Right"
        right = 4,
        //% blockId="Stop" block="Stop"
        stop = 5
    }

    /**
     * Read ultrasonic sensor.
     */

    //% blockId=ultrasonic_sensor block="read ultrasonic sensor |%unit "
    //% weight=95
    export function Ultrasonic(unit: PingUnit, maxCmDistance = 500): number {
        let d
        pins.digitalWritePin(DigitalPin.P12, 1);
        basic.pause(1)
        pins.digitalWritePin(DigitalPin.P12, 0);
        if (pins.digitalReadPin(DigitalPin.P13) == 0) {
            pins.digitalWritePin(DigitalPin.P12, 0);
            //sleep_us(2);
            pins.digitalWritePin(DigitalPin.P12, 1);
            //sleep_us(10);
            pins.digitalWritePin(DigitalPin.P12, 0);
            d = pins.pulseIn(DigitalPin.P13, PulseValue.High, maxCmDistance * 58);//readPulseIn(1);
        } else {
            pins.digitalWritePin(DigitalPin.P12, 0);
            pins.digitalWritePin(DigitalPin.P12, 1);
            d = pins.pulseIn(DigitalPin.P13, PulseValue.Low, maxCmDistance * 58);//readPulseIn(0);
        }
        let x = d / 39;
        if (x <= 0 || x > 500) {
            return 0;
        }
        switch (unit) {
            case PingUnit.Centimeters: return Math.round(x);
            default: return Math.idiv(d, 2.54);
        }

    }


     /**
     * Read line tracking sensor.
     */

    //% weight=20
    //% blockId=read_Patrol block="read |%patrol line tracking sensor"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function readPatrol(patrol: Patrol): number {
        if (patrol == Patrol.PatrolLeft) {
            return pins.analogReadPin(AnalogPin.P2)
        } else if (patrol == Patrol.PatrolRight) {
            return pins.analogReadPin(AnalogPin.P1)
        } else {
            return -1
        }
    }


     /**
     * Speed.
     */

    //% weight=20
    //% blockId=Speed block="read |%Speedstatus SPEED"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function MotorSpeed(Speedstatus: speedstatus): number {
        if (Speedstatus == speedstatus.iron) {
            if(pins.digitalReadPin(DigitalPin.P5)==1){
                return 1
            }
            else {
                return 0
            }
        } 
        else if (Speedstatus == speedstatus.iroff) {
            if(pins.digitalReadPin(DigitalPin.P11)==1){
                return 3
            } 
            else {
                return 0
            }
        }
        else {
            return 5
        }
    }


     /**
     * runningTime.
     */

    //% weight=20
    //% blockId=tracking_sensor block="on |%speed1 line tracking sensor|%vi "
    export function tracking_sensor(value: Patrol1,vi: number, body: () => void): void
    {
        if (value == Patrol1.PatrolLeft) {
            if (pins.digitalReadPin(DigitalPin.P2)==1){
                let state = value + vi;
                serial.writeNumber(state)
            }
        }
        if (value == Patrol1.PatrolRight) {
            if (pins.digitalReadPin(DigitalPin.P1)==1){
                let state = value + vi;
                serial.writeNumber(state)
            }
        }
    }



   /**
    * Enable IR LED.
    */

   //% blockId=IR_Enable block="Set the infrared status to |%irstatus"
   //% irstatus.fieldEditor="gridpicker" irstatus.fieldOptions.columns=2 
   //% weight=93 blockGap=8

   export function IREnable(IRstatus: irstatus): void {
       if (IRstatus == irstatus.iron) {
           pins.digitalWritePin(DigitalPin.P14, 1)
       } else if (IRstatus == irstatus.iroff) {
           pins.digitalWritePin(DigitalPin.P14, 0)
       } 
   }

   /**
    * Stop the Q-Car
    */

   //% blockId=Stop_QCar block="Stop the Q-Car"
   //% weight=94 blockGap=8

   export function Stop(): void {

    // Low byte of onStep
    write(64, 0x06, 0 & 0xFF)
    write(64, 0x07, (0 >> 8) & 0x0F)
    write(64, 0x08, 4095 & 0xFF)
    write(64, 0x09, (4095 >> 8) & 0x0F)
        
    write(64, 0x0A, 0 & 0xFF)
    write(64, 0x0B, (0 >> 8) & 0x0F)
    write(64, 0x0C, 4095 & 0xFF)
    write(64, 0x0D, (4095 >> 8) & 0x0F)

    write(64, 0x0E, 0 & 0xFF)
    write(64, 0x0E, (0 >> 8) & 0x0F)
    write(64, 0x10, 4095 & 0xFF)
    write(64, 0x11, (4095 >> 8) & 0x0F)

    write(64, 0x12, 0 & 0xFF)
    write(64, 0x13, (0 >> 8) & 0x0F)
    write(64, 0x14, 4095 & 0xFF)
    write(64, 0x15, (4095 >> 8) & 0x0F)
    } 


   /**
    * Contral The Q-Car.
    */

   //% blockId=Q-Car_Direction block="Let the Q-Car |%Direction"
   //% Direction.fieldEditor="gridpicker" Direction.fieldOptions.columns=5 
   //% weight=95 blockGap=8

   export function QCar_Direction(Car_Direction: Direction): void {
    if (Car_Direction == Direction.foward) {

        write(64, 0x06, 0 & 0xFF)
        write(64, 0x07, (0 >> 8) & 0x0F)
        write(64, 0x08, 4095 & 0xFF)
        write(64, 0x09, (4095 >> 8) & 0x0F)
            
        write(64, 0x0A, 4095 & 0xFF)
        write(64, 0x0B, (4095 >> 8) & 0x0F)
        write(64, 0x0C, 0 & 0xFF)
        write(64, 0x0D, (0 >> 8) & 0x0F)

        write(64, 0x0E, 4095 & 0xFF)
        write(64, 0x0F, (4095 >> 8) & 0x0F)
        write(64, 0x10, 0 & 0xFF)
        write(64, 0x11, (0 >> 8) & 0x0F)

        write(64, 0x12, 0 & 0xFF)
        write(64, 0x13, (0 >> 8) & 0x0F)
        write(64, 0x14, 4095 & 0xFF)
        write(64, 0x15, (4095 >> 8) & 0x0F)
    } 
    else if (Car_Direction == Direction.back) {

        write(64, 0x06, 4095 & 0xFF)
        write(64, 0x07, (4095 >> 8) & 0x0F)
        write(64, 0x08, 0 & 0xFF)
        write(64, 0x09, (0 >> 8) & 0x0F)
            
        write(64, 0x0A, 0 & 0xFF)
        write(64, 0x0B, (0 >> 8) & 0x0F)
        write(64, 0x0C, 4095 & 0xFF)
        write(64, 0x0D, (4095 >> 8) & 0x0F)


        write(64, 0x0E, 0 & 0xFF)
        write(64, 0x0F, (0 >> 8) & 0x0F)
        write(64, 0x10, 4095 & 0xFF)
        write(64, 0x11, (4095 >> 8) & 0x0F)

        write(64, 0x12, 4095 & 0xFF)
        write(64, 0x13, (4095 >> 8) & 0x0F)
        write(64, 0x14, 0 & 0xFF)
        write(64, 0x15, (0  >> 8) & 0x0F)
    } 
    else if (Car_Direction == Direction.left) {

        write(64, 0x06, 0 & 0xFF)
        write(64, 0x07, (0 >> 8) & 0x0F)
        write(64, 0x08, 4095 & 0xFF)
        write(64, 0x09, (4095 >> 8) & 0x0F)
            
        write(64, 0x0A, 4095 & 0xFF)
        write(64, 0x0B, (4095 >> 8) & 0x0F)
        write(64, 0x0C, 0 & 0xFF)
        write(64, 0x0D, (0 >> 8) & 0x0F)


        write(64, 0x0E, 0 & 0xFF)
        write(64, 0x0F, (0 >> 8) & 0x0F)
        write(64, 0x10, 4095 & 0xFF)
        write(64, 0x11, (4095 >> 8) & 0x0F)

        write(64, 0x12, 4095 & 0xFF)
        write(64, 0x13, (4095 >> 8) & 0x0F)
        write(64, 0x14, 0 & 0xFF)
        write(64, 0x15, (0  >> 8) & 0x0F)
        
    } 
    else if (Car_Direction == Direction.right) {

        write(64, 0x06, 4095 & 0xFF)
        write(64, 0x07, (4095 >> 8) & 0x0F)
        write(64, 0x08, 0 & 0xFF)
        write(64, 0x09, (0 >> 8) & 0x0F)
            
        write(64, 0x0A, 0 & 0xFF)
        write(64, 0x0B, (0 >> 8) & 0x0F)
        write(64, 0x0C, 4095 & 0xFF)
        write(64, 0x0D, (4095 >> 8) & 0x0F)


        write(64, 0x0E, 4095 & 0xFF)
        write(64, 0x0F, (4095 >> 8) & 0x0F)
        write(64, 0x10, 0 & 0xFF)
        write(64, 0x11, (0 >> 8) & 0x0F)

        write(64, 0x12, 0 & 0xFF)
        write(64, 0x13, (0 >> 8) & 0x0F)
        write(64, 0x14, 4095 & 0xFF)
        write(64, 0x15, (4095 >> 8) & 0x0F)
    } 
    else if (Car_Direction == Direction.stop) {

        // Low byte of onStep
        write(64, 0x06, 0 & 0xFF)
        write(64, 0x07, (0 >> 8) & 0x0F)
        write(64, 0x08, 4095 & 0xFF)
        write(64, 0x09, (4095 >> 8) & 0x0F)
            
        write(64, 0x0A, 0 & 0xFF)
        write(64, 0x0B, (0 >> 8) & 0x0F)
        write(64, 0x0C, 4095 & 0xFF)
        write(64, 0x0D, (4095 >> 8) & 0x0F)
    
        write(64, 0x0E, 0 & 0xFF)
        write(64, 0x0F, (0 >> 8) & 0x0F)
        write(64, 0x10, 4095 & 0xFF)
        write(64, 0x11, (4095 >> 8) & 0x0F)
    
        write(64, 0x12, 0 & 0xFF)
        write(64, 0x13, (0 >> 8) & 0x0F)
        write(64, 0x14, 4095 & 0xFF)
        write(64, 0x15, (4095 >> 8) & 0x0F)
    } 
}

    /**
     * Used to set the pulse range (0-4095) of a given pin on the PCA9685
     * @param chipAddress [64-125] The I2C address of your PCA9685; eg: 64
     * @param pinNumber The pin number (0-15) to set the pulse range on
     * @param onStep The range offset (0-4095) to turn the signal on
     * @param offStep The range offset (0-4095) to turn the signal off
     */
    //% block advanced=true
    export function setPinPulseRange(pinNumber: PinNum = 0, onStep: number = 0, offStep: number = 2048, chipAddress: number = 0x40): void {
        pinNumber = Math.max(0, Math.min(15, pinNumber))
        const buffer = pins.createBuffer(2)
        const pinOffset = PinRegDistance * pinNumber
        onStep = Math.max(0, Math.min(4095, onStep))
        offStep = Math.max(0, Math.min(4095, offStep))

        debug(`setPinPulseRange(${pinNumber}, ${onStep}, ${offStep}, ${chipAddress})`)
        debug(`  pinOffset ${pinOffset}`)

        // Low byte of onStep
        write(chipAddress, pinOffset + channel0OnStepLowByte, onStep & 0xFF)

        // High byte of onStep
        write(chipAddress, pinOffset + channel0OnStepHighByte, (onStep >> 8) & 0x0F)

        // Low byte of offStep
        write(chipAddress, pinOffset + channel0OffStepLowByte, offStep & 0xFF)

        // High byte of offStep
        write(chipAddress, pinOffset + channel0OffStepHighByte, (offStep >> 8) & 0x0F)
    }

    function calcFreqPrescaler(freq: number): number {
        return (25000000 / (freq * chipResolution)) - 1;
    }


        /**
     * Used to setup the chip, will cause the chip to do a full reset and turn off all outputs.
     * @param chipAddress [64-125] The I2C address of your PCA9685; eg: 64
     * @param freq [40-1000] Frequency (40-1000) in hertz to run the clock cycle at; eg: 50
     */
    //% block advanced=true
    export function init(chipAddress: number = 0x40, newFreq: number = 50) {
        debug(`Init chip at address ${chipAddress} to ${newFreq}Hz`)
        const buf = pins.createBuffer(2)
        const freq = (newFreq > 1000 ? 1000 : (newFreq < 40 ? 40 : newFreq))
        const prescaler = calcFreqPrescaler(freq)

        write(chipAddress, modeRegister1, sleep)

        write(chipAddress, PrescaleReg, prescaler)

        write(chipAddress, allChannelsOnStepLowByte, 0x00)
        write(chipAddress, allChannelsOnStepHighByte, 0x00)
        write(chipAddress, allChannelsOffStepLowByte, 0x00)
        write(chipAddress, allChannelsOffStepHighByte, 0x00)

        write(chipAddress, modeRegister1, wake)

        control.waitMicros(1000)
        write(chipAddress, modeRegister1, restart)
    }
}