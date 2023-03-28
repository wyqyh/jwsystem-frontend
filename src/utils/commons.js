
export function getTree(tree = []) {
  let arr = [];
  if(tree.length !== 0) {
    tree.forEach(item => {
      let obj = {}
      obj.label = item.name
      obj.id = item.id
      if(item.children) {
        obj.children = getTree(item.children)
      }
      arr.push(obj)
    })
  }
  return arr
}