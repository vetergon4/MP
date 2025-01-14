import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomModal = ({ isOpen, onRequestClose, marker }) => {
  const handlePayment = () => {
    alert(`You have paid ${marker.price} for this buoy.`);
    onRequestClose();
  };

  return (
    <Modal show={isOpen} onHide={onRequestClose} contentLabel="Marker Details">
      <Modal.Header closeButton>
        <Modal.Title>{marker.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{marker.description}</p>
        <p>Price: {marker.price}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onRequestClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePayment}>
          Pay this buoy
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
