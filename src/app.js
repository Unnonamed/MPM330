const Modbus = require('./Modbus')
const Mpm330 = require('./Mpm330')
const modbus = new Modbus('/dev/serial0', 19200)
// const modbus = new Modbus('/dev/ttyUSB0', 19200)
// let MPmDevice = new Mpm330()

const DeviceId = [1,2]
const MpmList = []

function register() {
    DeviceId.forEach((id) => {
        let MpmDevice = new Mpm330(id)
        MpmList.push(MpmDevice)
    });
}

function UpdateData() {
    console.log('Update Data')

    MpmList.map(MpmDevice => {
        setTimeout(() => {
            modbus.read(MpmDevice.id, 0, 63).then(data => {
                MpmDevice.parse(data.data)
            })
            //modbus.readTest(MpmDevice.id, 0, 63)
        }, MpmDevice.id * 1000);
    })
}


setTimeout(() => {
    register()
    setInterval(() => {
        UpdateData()
    }, 3000);
}, 1000);
