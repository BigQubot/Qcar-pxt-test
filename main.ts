
let qcarparam = 0
let qcarparam1 = 1
enum PingUnit {
    //% block="cm"
    Centimeters,
}


//% weight=0 color=#00BFFF icon="\uf2c4" block="Qcar"
namespace qcar {
    let state:number;
    let leftspeed1:number = 0;
    let rightspeed1:number = 0;
    let LeftMotor:number = 0;
    let RightMotor:number = 0;
    let LeftCount:number = 0;
    let RightCount:number = 0;
    let LastTime:number

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
            if(pins.onPulsed(DigitalPin.P5,1, () => { })){
                return 1
            }
            else {
                return 2
            }
        } 
        else if (Speedstatus == speedstatus.iroff) {
            if(pins.onPulsed(DigitalPin.P11,1, () => { })){
                return 3
            } 
            else {
                return 4
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
    * Read Motor Speed.
    */

   //% weight=10
   //% blockId=Motor_Speed block="read |%speed Motor Speed"
   //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function Motor_Speed(speed: Speed): number {
        if (speed == Speed.LeftSpeed) {
            if ((input.runningTime()-LastTime) < 1000) {
                if (input.onButtonPressed(Button.B, () => { })) {
                    LeftCount=LeftCount+1
                }
            }
            else if ((input.runningTime()-LastTime) > 1000) {
                leftspeed1=LeftCount*5;
                LastTime=input.runningTime();
            }
            return leftspeed1
        } 
        else if (speed == Speed.RightSpeed) {
            if ((input.runningTime()-LastTime) < 1000) {
                if (input.onButtonPressed(Button.A, () => { })){
                    RightCount=RightCount+1
                }
            }
            else if ((input.runningTime()-LastTime) > 1000) {
                rightspeed1=RightCount*5;
                LastTime=input.runningTime();
            }
            return rightspeed1
        }
        else {
            return -1
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

}