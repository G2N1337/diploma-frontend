import React from 'react';
import { ModalContent, Model } from '../../pages/entertainment/[id]';
import HolidayOrder from '../forms/holiday-order.component';

interface IProps {
  openModal: boolean;
  toggleModal: (e: React.SyntheticEvent) => void;
}

export default function BanquetModal({ openModal, toggleModal }: IProps) {
  return (
    <ModalContent>
      <Model isOpen={openModal} onBackgroundClick={toggleModal}>
        <HolidayOrder />
      </Model>
    </ModalContent>
  );
}
