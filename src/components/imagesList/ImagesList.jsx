import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import Typography from '@mui/material/Typography';
import ImageListItem from '@mui/material/ImageListItem';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import moment from 'moment';
import { Avatar, Tooltip } from '@mui/material';
import Options from './Option';
import useFirestore from '../../firebase/useFirestore';

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function ImagesList() {
  const { documents } = useFirestore('gallery');

  const [isOpen, setIsOpen] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);

  return (
    <>
      <ImageList variant='quilted' cols={4} rowHeight={200}>
        {documents.map((item, index) => (
          <ImageListItem
            key={item?.id}
            cols={
              pattern[
                index - Math.floor(index / pattern.length) * pattern.length
              ].cols
            }
            rows={
              pattern[
                index - Math.floor(index / pattern.length) * pattern.length
              ].rows
            }
            sx={{
              opacity: '.7',
              transition: 'opacity .3s linear',
              cursor: 'pointer',
              border: '1px solid gray',
              borderRadius: '2%',
              '&:hover': { opacity: 1 },
            }}
          >
            <Options
              imageId={item?.id}
              uid={item?.data?.uid}
              imgURL={item?.data?.imageURL}
            />

            <img
              {...srcset(
                item?.data?.imageURL,
                200,
                pattern[
                  index - Math.floor(index / pattern.length) * pattern.length
                ].rows,
                pattern[
                  index - Math.floor(index / pattern.length) * pattern.length
                ].cols
              )}
              alt={item?.data?.name || item?.data?.email.split('@')[0]}
              loading='lazy'
              onClick={() => {
                setPhotoIndex(index);
                setIsOpen(true);
              }}
            />
            <Typography
              variant='body'
              component='span'
              sx={{
                position: 'absolute',
                left: '0',
                bottom: '0px',
                color: 'white',
                background: 'rgba(0,0,0,0.3)',
                padding: '15px',
                borderTopRightRadius: 8,
              }}
            >
              {moment(item?.data?.timestamp?.toDate()).fromNow()}
            </Typography>
            <Tooltip
              title={item?.data?.name || item?.data?.email.split('@')[0]}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: '3px',
              }}
            >
              <Avatar
                src={item?.data?.photo}
                imgProps={{ 'aria-hidden': true }}
              />
            </Tooltip>
          </ImageListItem>
        ))}
      </ImageList>
      {isOpen && (
        <Lightbox
          mainSrc={documents[photoIndex]?.data?.imageURL}
          nextSrc={
            documents[(photoIndex + 1) % documents.length]?.data?.imageURL
          }
          prevSrc={
            documents[(photoIndex + documents.length - 1) % documents.length]
              ?.data?.imageURL
          }
          onCloseRequest={() => setIsOpen(false)}
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % documents.length)
          }
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + documents.length - 1) % documents.length
            )
          }
          imageTitle={documents[photoIndex]?.data?.name}
          imageCaption={documents[photoIndex]?.data?.email}
        />
      )}
    </>
  );
}

const pattern = [
  {
    rows: 2,
    cols: 2,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 2,
  },
  {
    rows: 1,
    cols: 2,
  },
  {
    rows: 2,
    cols: 2,
  },
  {
    rows: 1,
    cols: 1,
  },
  {
    rows: 1,
    cols: 1,
  },
];
