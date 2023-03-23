
export function resetForm(refName) {
  if(this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

export function addDateRange(params, dateRange) {
  const search = params
  search.params = typeof(search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {}
  dateRange = Array.isArray(dateRange) ? dateRange : []
  search.beginTime = dateRange[0]
  search.endTime  = dateRange[1]
  return search
}

export function transParams(params) {
  let result = ''
  for(const propName of Object.keys(params)) {
    const value = params[propName]
    var part = encodeURIComponent(propName) + '='
    if(value !== null && typeof(value) !== 'undefined') {
        if(typeof(value) == 'object') {
          for(const key of Object.keys(value)) {
            if(value[key] !== null && typeof(value[key]) !== 'undefined'){
              let params = propName + '[' + key + ']'
              var subPart = encodeURIComponent(params) + '='
              result += subPart + encodeURIComponent(value[key]) + '&'
            }
          }
        } else {
          result += part + encodeURIComponent(value) + '&'
        }
    }
  }
  return result
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
