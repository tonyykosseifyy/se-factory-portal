export const arraySubset = (arr, target) => {
    const filtered =[]
    arr.map((e) => {
        if(target.includes(e)){
            filtered.push(e)
        }
    })
    return filtered.length > 0
}
