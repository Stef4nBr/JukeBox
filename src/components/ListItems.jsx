import React from 'react';
import { formatTimeAgo } from '../utils/formatTimeAgo'
import shortid from 'shortid';

const ListItems = ({ urls, getUrlFromListItem, currentUrlItem }) => {


  if (!urls) {
    return (
      <a key={shortid.generate()} href="#123" className="list-group-item list-group-item-action py-3 lh-sm">
        <div className="d-flex w-100 align-items-center justify-content-between">
          <strong className="mb-1"></strong>
          <small className="text-body-secondary"></small>
        </div>
        <div className="col-10 mb-1 small">
          YOUR LIST IS EMPTY !
        </div>
      </a>)
  }

  return (
    urls?.map((item) =>
    
      <a key={shortid.generate()} onClick={() => {getUrlFromListItem(item); console.log('sending item...',item)}}
      
        href="#" className={`list-group-item list-group-item-action py-3 lh-sm ${item.url.trim() === currentUrlItem?.url ? 'active' : ''}`}>   
        <div className="d-flex w-100 align-items-center justify-content-between">
          <strong className="mb-1 text-clip text-truncate">{item.description || item.url}</strong>
          <small className="text-body-secondary">{formatTimeAgo(item.added)}</small>
        </div>
        <div className="col-10 mb-1 small">
          {item.messege}
        </div>
      </a>
    )
  );
};

export default ListItems;
