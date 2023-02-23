function UnMarshaller() {
}

UnMarshaller.prototype.unMarshal = function (data) {
  if (data.length > 3) {
    return {
      'int0': data[0],
      'operator': String.fromCharCode(data[1]),
      'int1': data[2],
      'ans': data[3]
    };
  } else {
    return {
      'int0': data[0],
      'operator': String.fromCharCode(data[1]),
      'int1': data[2]
    };
  }
  
}

module.exports = UnMarshaller;