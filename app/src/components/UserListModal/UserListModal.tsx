import Modal from '../Modal'
import { BandContext } from "../BandsProvider";
import { Download, XCircle, Trash } from 'lucide-react';
import classes from './Modal.module.css'
import React from 'react';
import useMatchMedia from '../../helpers/useMatchMedia';

function UserListModal({ isOpen, handleOpen }) {
  const { clearUserList, removeTrackFromUserList, userLikedTracksList, downloadUserList } = React.useContext(BandContext)
  const mediaNarrow = useMatchMedia()
  const total = userLikedTracksList.length
  return <Modal title="Your list" description={`${total} ${total > 1 ? 'songs' : 'song'}`}
    isOpen={isOpen} handleOpen={handleOpen}>
    <div className='flex flex-col lg:flex-row justify-center gap-5 m-10'>
      <button className="clearButton" onClick={downloadUserList}>
        <Download />
        download as csv
      </button>
      <button className="clearButton" onClick={clearUserList}>
        <Trash />
        clear list
      </button>
    </div>

    <ul className={classes.trackList}>
      {userLikedTracksList.map(item =>
        <React.Fragment key={item.id}>
          <li className={classes.track}>
            <img src={item.album.cover_medium} />

            <div className={classes.info}>
              <a href={item.link} target="_blank"><h4>{item.title}</h4></a>
              <p><strong>Band:</strong> {item.artist.name}</p>
              <p><strong>Released:</strong> {item.release_date}</p>
              <p><strong>Album:</strong> {item.album.title}</p>
            </div>
            <button onClick={() => removeTrackFromUserList(item.id)} className="clearButton">
              <XCircle size={mediaNarrow ? 30: 45} />
            </button>
          </li>
          {/* <hr /> */}
        </React.Fragment>
      )}
    </ul>
  </Modal>;
}

export default UserListModal;
