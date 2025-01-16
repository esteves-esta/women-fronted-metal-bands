import Modal from '../Modal'
import { BandContext } from "../../components/BandsProvider";
import { Download, XCircle, Trash } from 'lucide-react';
import React from 'react';
import useMatchMedia from '../../helpers/useMatchMedia';
import { styled } from "styled-components";

function UserListModal({ isOpen, handleOpen }) {
  const { clearUserList, removeTrackFromUserList, userLikedTracksList, downloadUserList } = React.useContext(BandContext)
  const mediaNarrow = useMatchMedia()
  const total = userLikedTracksList.length
  return <Modal title="Your list" description={`${total} ${total > 1 ? 'songs' : 'song'}`}
    isOpen={isOpen} handleOpen={handleOpen}>
    <Container>
      <IconButton onClick={downloadUserList}>
        <Download />
        download as csv
      </IconButton>
      <IconButton onClick={clearUserList}>
        <Trash />
        clear list
      </IconButton>
    </Container>

    <TrackList>
      {userLikedTracksList.map(item =>
        <React.Fragment key={item.id}>
          <TrackItem >
            <img src={item.album.cover_medium} />

            <TrackInfo >
              <a href={item.link} target="_blank"><h4>{item.title}</h4></a>
              <p><strong>Band:</strong> {item.artist.name}</p>
              <p><strong>Released:</strong> {item.release_date}</p>
              <p><strong>Album:</strong> {item.album.title}</p>
            </TrackInfo>
            <IconButton onClick={() => removeTrackFromUserList(item.id)}>
              <XCircle size={mediaNarrow ? 30 : 45} />
            </IconButton>
          </TrackItem>
          {/* <hr /> */}
        </React.Fragment>
      )}
    </TrackList>
  </Modal>;
}

export default UserListModal;

const Container = styled.div`
display: flex;
justify-content: center;
flex-direction: col;
gap: 15px;
margin: 10px 0px
`

const IconButton = styled.button`
  display: flex;
  justify-content: center;
  gap: 10px;
  background-color: transparent;
  cursor: pointer;
  border: none;
  color: var(--text-color-alpha-9);
`

const TrackItem = styled.li`
  display: flex;
  gap: 25px;
  align-items: center;
  margin: 15px 0px;
  border: 1px solid var(--color-dark-alpha-5);
  padding: 15px;
  border-radius: 5px;

  img {
    height: 130px;
    border-radius: 8px;
  }

  
@media screen and (min-width: 0px) and (max-width: 640px) {
  flex-direction: column;
  align-items: flex-start;

  & img {
    width: 100%;
    object-fit: cover;
    object-position: 0px 20%;
  }

  & > button {
    align-self: center;
  }
}
`

const TrackList = styled.ul`
  margin-top: 45px;
  padding: 0px;
`;

const TrackInfo = styled.div`
  width: 100%;

  a {
    text-decoration: none;
    color: var(--color-secondary-light);
    font-family: var(--primary-font-family);
  }

  & strong {
    font-weight: 600;
  }

 & a {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
`