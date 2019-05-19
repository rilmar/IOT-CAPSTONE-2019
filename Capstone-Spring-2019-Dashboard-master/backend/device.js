
/**
 * 
 * A simulated device aimed at generating noisy telemetry
 * 
 * Overloaded constructors allow for simple random setup or full control over noise curves
 * 
 */

class Device {
    /**
     * 
     * @param {*} id Device ID
     * @param {*} dataType Datatype that device will report
     * @param {*} startingValue Array of datatypes and their starting values
     * Base value, i.e. temperature = 75
     * 
     * Telemetry will have noise around starting value
     * Overload generates random seed for noise 
     */
    constructor(id, startingValueList){
        this.deviceID = id;
        startingValueList.forEach(element => {
            element.tick1 = 0;
            element.tick2 = 0;
            element.tick1Increase = Math.random();
            element.tick2Increase = Math.random();
            element.phaseShift = Math.PI/2; // changes start of phase
            element.amplitudeShift = 0.5; // changes height of curve
            element.periodShift = 0.25; // changes period of function
        });
        this.dataList = startingValueList;
    }

    /**
     * 
     * @param {*} callBack function to ingest data
     */
    startTelemetry(callBack){
        this.intervalFunction = setInterval(function () {
            

            let telemetry = {
                "device": this.deviceID,
                "datatype": {},
            }

            this.dataList.forEach(element =>{
                let noise1 = Math.sin(element.tick1); //sine noise
                let noise2 = (element.amplitudeShift * Math.cos(((element.periodShift * element.tick2) + element.phaseShift))); //cosine noise
                let reportedValue = element.baseValue + noise1 + noise2;

                element.tick1 = element.tick1 + element.tick1Increase;
                element.tick2 = element.tick2 + element.tick2Increase;

                telemetry.datatype[element.dataType] = {
                    "value": reportedValue,
                    "time": new Date() 
                }; 
            });

            callBack(telemetry);
        }.bind(this), 100);
    }

    /**
     * 
     */
    stopTelemetry(){
        clearInterval(this.intervalFunction)
    }
}

module.exports = Device;

/*
    Prototype

      "device": "device1", 
      "datatype": 
          {"temp": [
              {"time": 1550675309000, "value": 35}, 
              {"time": 1550675309600, "value": 37}], 
          "wind": [
              {"time": 1550675309000, "value": 12}]}
*/