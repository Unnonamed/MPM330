class Mpm330 {
    constructor(id) {

        this.data = { isUpdated: false, inverterData: {} }
        this.id = id
        console.log(`MPM330 Data ID : ${id}`)
    }

    parse(data) {
        // console.log('parsing')
        data = Array.from(data)
        
        try {
            const MpmData = {}
            // 기존 Address 보다 +1 
            MpmData.rsVolt = ((data[1] * 65536 + data[2])*0.01).toFixed(2)
            MpmData.stVolt = ((data[3] * 65536 + data[4])*0.01).toFixed(2)
            MpmData.trVolt = ((data[5] * 65536 + data[6])*0.01).toFixed(2)
            MpmData.rVolt = ((data[7] * 65536 + data[8])*0.01).toFixed(2)
            MpmData.sVolt = ((data[9] * 65536 + data[10])*0.01).toFixed(2)
            MpmData.tVolt = ((data[11] * 65536 + data[12])*0.01).toFixed(2)
            MpmData.rCurrent = ((data[13] * 65536 + data[14])*0.001).toFixed(2)
            MpmData.sCurrent = ((data[15] * 65536 + data[16])*0.001).toFixed(2)
            MpmData.tCurrent = ((data[17] * 65536 + data[18])*0.001).toFixed(2)
            MpmData.totalActivePower = ((data[19] * 65536 + data[20])*0.001).toFixed(2)
            MpmData.totalReactivePower = ((data[21] * 65536 + data[22])*0.001).toFixed(2)
            MpmData.totalApparentPower = ((data[23] * 65536 + data[24])*0.001).toFixed(2)
            MpmData.frquency = ((data[25] * 65536 + data[26])*0.1).toFixed(2)
            MpmData.averageFrquency = (Buffer.from(hexSqlite(((data[27] * 65536 + data[28])),2)).readInt16BE(0)).toFixed(2)
            MpmData.activePower = (data[29] * 65536 + data[30]).toFixed(2)
            MpmData.reactivePower = (data[31] * 65536 + data[32]).toFixed(2)
            MpmData.activePowerPeak = ((data[33] * 65536 + data[34])*0.001).toFixed(2)
            MpmData.rCurrentPeak = ((data[35] * 65536 + data[36])*0.001).toFixed(2)
            MpmData.sCurrentPeak = ((data[37] * 65536 + data[38])*0.001).toFixed(2)
            MpmData.tCurrentPeak = ((data[39] * 65536 + data[40])*0.001).toFixed(2)
            MpmData.rActivePower = ((Buffer.from(hexSqlite(((data[41] * 65536 + data[42])),2)).readInt16BE(0))*0.001).toFixed(2)
            MpmData.sActivePower = ((Buffer.from(hexSqlite(((data[43] * 65536 + data[44])),2)).readInt32BE(0))*0.001).toFixed(2)
            MpmData.tActivePower = ((Buffer.from(hexSqlite(((data[45] * 65536 + data[46])),2)).readInt32BE(0))*0.001).toFixed(2)
            MpmData.rReactivePower = ((Buffer.from(hexSqlite(((data[47] * 65536 + data[48])),2)).readInt32BE(0))*0.001).toFixed(2)
            MpmData.sReactivePower = ((Buffer.from(hexSqlite(((data[49] * 65536 + data[50])),2)).readInt32BE(0))*0.001).toFixed(2)
            MpmData.tReactivePower = ((Buffer.from(hexSqlite(((data[51] * 65536 + data[52])),2)).readInt32BE(0))*0.001).toFixed(2)
            MpmData.rApparentPower = ((data[53] * 65536 + data[54])*0.001).toFixed(2)
            MpmData.sApparentPower = ((data[55] * 65536 + data[56])*0.001).toFixed(2)
            MpmData.tApparentPower = ((data[57] * 65536 + data[58])*0.001).toFixed(2)
            MpmData.rfrquency = ((Buffer.from(hexSqlite(((data[59] * 65536 + data[60])),2)).readIntBE(0,2))*0.01).toFixed(2)
            MpmData.sfrquency = ((Buffer.from(hexSqlite(((data[61] * 65536 + data[62])),2)).readIntBE(0,2))*0.01).toFixed(2)
            MpmData.tfrquency = ((Buffer.from(hexSqlite(((data[63] * 65536 + data[64])),2)).readIntBE(0,2))*0.01).toFixed(2)
    
            this.data.MpmData = MpmData
            this.data.isUpdated = true
    
            console.log(`parser done MpmData ${this.id}`, MpmData)
    
        } catch (error) {
            this.data.MpmData = {}
            this.data.isUpdated = false
            console.error(error)
        }
    }

    report() {
        if(this.data.isUpdated) {
            this.data.isUpdated = false
            const inverterData = this.data.MpmData

            return inverterData
        } else {
            return null
        }
    }

    
}

module.exports = Mpm330;

// value dec값 size 나눌 자릿 수 앞에 0x 할당
function hexSqlite(value, size) {
    const arr = []
    let str = value.toString(16)

    if (str.length < size) {
        // console.log(`str : ${str} str.length : ${str.length} size : ${size} value : ${value}`)
        for (let index = 0; index < 4; index++) {
            arr.push('0x'+pad(0,size))
        }
        // throw new Error('size over')
    }
    else {
        for (let i = 0, l = str.length; i < l; i+= size) {
            const hex = str.substr(i, size).toString(16)
            arr.push('0x'+pad(hex,size))
        }
    }
    // console.log('arr : ', arr)
    return arr // .join('')

}
// n 값 width 자릿수 : 자릿수 만큼 없는 자리에 0 값 할당
function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}


