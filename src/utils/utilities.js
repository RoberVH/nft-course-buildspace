import React from 'react';
import Identicon from 'react-identicons';
import "./utilities.css"

export const frmatAccount = (account) => {
    const upAccount = account.toUpperCase()
    const shotAccount = upAccount.slice(0,4) + '...' + upAccount.slice(39,42)
return (
    <div className="address-bar-class"> 
    <span >
         <Identicon string={shotAccount} size={15} fg = {'green'} />
         &nbsp; {shotAccount}
    </span>
    </div>
)

}