class Modbus {
    constructor(port, baudRate) {
        const ModbusRTU = require('modbus-serial');
        
        // console.log('Modbus start')

        this.client = new ModbusRTU();
        this.client.connectRTUBuffered(port, { baudRate: baudRate });
    }

    read(id, start, lenght) {
        console.log('Modbus.read')
        
        this.client.setID(id);
        return this.client.readHoldingRegisters(start, lenght);
    }

    readTest(id, start, lenght) {
        this.id = id
        console.log('Modbus.read test : ', id)
        
        this.client.setID(id);
        return this.client.readHoldingRegisters(start, lenght, function(_err, data) {
            console.log(data.data)
        });
    }
}

module.exports = Modbus;

if (require.main === module) {
    const modbus = new Modbus('/dev/serial0', 19200);

    setInterval(() => {
        modbus.readTest(1, 0, 63);
    }, 1000);
}
