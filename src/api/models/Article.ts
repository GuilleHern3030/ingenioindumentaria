export const Model:Record<string, any> = {
  ID: {
    type: "number",
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  Name: {
    type: "string",
    allowNull: false
  },
  Category: {
    type: "string",
    allowNull: true,
    defaultValue: "Otros"
  },
  Description: {
    type: "string",
    allowNull: true,
    defaultValue: ""
  },
  Price: {
    type: "number",
    allowNull: false
  },
  Sizes: {
    type: "string",
    allowNull: true,
    defaultValue: "U" // unique
  },
  Sex: {
    type: "string",
    allowNull: true,
    defaultValue: "U" // unique
  },
  Recent: {
    type: "string",
    allowNull: true,
    defaultValue: "F" // false
  },
  InStock: {
    type: "string",
    allowNull: true,
    defaultValue: "T" // true
  },
  ImageSrc: {
    type: "string",
    allowNull: true
  },
  Discount: {
    type: "number",
    allowNull: true
  },
  Date: {
    type: "string",
    allowNull: false
  }
}

export const hasUniqueValues = (JSONs:Array<Record<string, any>>) => {

  // Gets the unique keys
  const uniqueKeys = []
  for (const key in Model) {
    if (Model[key].unique && Model[key].unique === true)
      uniqueKeys.push(key)
  }

  if (uniqueKeys.length > 0) {
    uniqueKeys.forEach(key => {
      JSONs.forEach(json => {
        const uniqueValue = json[key]
        const jsonsWithSameValue = JSONs.filter(json => json[key] === uniqueValue)
        if (jsonsWithSameValue.length > 1) 
          throw new Error(`${json[key]} isn't unique`)
      })
    })
  } else return false;
  return true
}

export const isValidFormat = (json:Record<string, any>):boolean => {
  if (Object.keys(Model).length == Object.keys(json).length) {
    for (const key in json) {
      if (key in Model) {

        // AllowNull & DefaultValue
        if (json[key] === null || json[key] === undefined || json[key].length == 0) {
          if (Model[key].allowNull && Model[key].allowNull === true)
            json[key] = Model[key].defaultValue || ""
          else throw new Error(`${key} don't allow null or undefined values`)
        }

        // TypeOf
        if (typeof(json[key]) !== Model[key].type) {
          if (Model[key].type === 'number' && !isNaN(Number(json[key])))
            json[key] = Number(json[key])
          else throw new Error(`${key} (${json[key]}) isn't a '${Model[key].type}'`)
        }

      } else throw new Error(`${key} isn't in the model`)
    }
  } else throw new Error("JSON and Model hasn't same keys")
  return true
}

export default Model