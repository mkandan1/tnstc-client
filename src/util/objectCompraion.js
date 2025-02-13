export const areObjectsEqual = (obj1, obj2, ignoreFields = []) => {
    const filterFields = (obj, fieldsToIgnore) => {
        return Object.keys(obj)
            .filter((key) => !fieldsToIgnore.includes(key))
            .reduce((filteredObj, key) => {
                filteredObj[key] = obj[key];
                return filteredObj;
            }, {});
    };

    const filteredObj1 = filterFields(obj1, ignoreFields);
    const filteredObj2 = filterFields(obj2, ignoreFields);

    return JSON.stringify(filteredObj1) === JSON.stringify(filteredObj2);
};
