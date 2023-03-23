import Cookies from "js-cookie";

const Uid = 'uid'
const UName = 'uname'
const Avatar = 'avatar'

export function setUid(uid) {
  return Cookies.set(Uid, uid)
}

export function getUid() {
  return Cookies.get(Uid)
}

export function removeUid() {
  return Cookies.remove(Uid)
}

export function setUName(uname) {
  return Cookies.set(UName, uname)
}

export function getUName() {
  return Cookies.get(UName)
}

export function removeUName() {
  return Cookies.remove(UName)
}

export function setAvatar(avatar) {
  return Cookies.set(Avatar, avatar)
}

export function getAvatar() {
  return Cookies.get(Avatar)
}

export function removeAvatar() {
  return Cookies.remove(Avatar)
}

