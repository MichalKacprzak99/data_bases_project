import React from 'react';

const UserProfile= ({userData}) => {
    return (
        <>
            <div>Uztkownik</div>
            {console.log(userData)}
            {Object.keys(userData).map((key,index)=> {
                return <div key={index}>{key}, {userData[key]}</div>
            })}
        </>


      );
}
export default UserProfile;