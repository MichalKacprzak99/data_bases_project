import React from 'react';

const UserProfile= ({userData}) => {

    const { pseudonim, imie, nazwisko, email } = userData
    return (
        <>
            <div>Psueudonim: {pseudonim}</div>
            <div>Imie: {imie}</div>
            <div>Nazwisko: {nazwisko}</div>
            <div>Email: {email}</div>
        </>


      );
}
export default UserProfile;