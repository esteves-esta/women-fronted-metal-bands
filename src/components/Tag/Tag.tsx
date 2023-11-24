import * as React from 'react';
import * as classes from './Tag.module.css';

export interface TagInfo {
  value: any;
  text: string;
  type: 'success' | 'info' | 'danger' | 'warning';
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
