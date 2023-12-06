import * as React from 'react';
import classes from './Tag.module.css';

type Notification = 'success' | 'info' | 'danger' | 'warning'
type Deep = 'deep-1' | 'deep-2' | 'deep-3' | 'deep-4' | 'dark'
export interface TagInfo {
  value: any;
  text: string;
  type: Notification | Deep;
}

function Tag({
  tagInfo,
  value
}: { value: any, tagInfo: TagInfo[] }) {

  const info = tagInfo.find(item => item.value === value)
  if (info) {
    const classNames = `${classes.tag} ${classes[info.type]}`
    return <span className={classNames}>{info.text}</span>;
  }
  return <span>-</span>
}

export default Tag;
