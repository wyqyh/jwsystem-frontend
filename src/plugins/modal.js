import { Message, MessageBox, Notification } from "element-ui";

export default {
  msgSuccess(content) {
    Message.success(content)
  },
  msgError(content) {
    Message.error(content)
  },
  msgWarning(content) {
    Message.warning(content)
  },
  confirm(content) {
    return MessageBox.confirm(content, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  },
  // 通知提示
  notify(content) {
    Notification.info(content)
  },
  // 错误通知
  notifyError(content) {
    Notification.error(content);
  },
  // 成功通知
  notifySuccess(content) {
    Notification.success(content)
  },
  // 警告通知
  notifyWarning(content) {
    Notification.warning(content)
  }
}