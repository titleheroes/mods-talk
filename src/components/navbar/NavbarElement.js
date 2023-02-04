import styled from 'styled-components'
import {NavLink as Link} from 'react-router-dom'
import {FaBars} from 'react-icons/fa'

export const Nav = styled.nav`
    background: #fff;
    
    height: 80px;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem calc((100vw - 1200px) / 2);
    z-index: 10;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
`

export const NavLink = styled(Link)`
    color: #333333;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 2.2rem;
    height: 100%;
    cursor: pointer;

    &.active{
        color: #f04e22;
    }

`

export const Bars = styled(FaBars)`
    display: none;
    color: #f04e22;

    @media screen and (max-width: 768px){
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;

    }
`

export const NavMenu = styled.div`
    display: flex;
    align-items: center;
    margin-right: 50px;
    
    white-space: nowrap;

    @media screen and (max-width: 768px){
        display: none;
    }
`
export const NavBtn0 = styled.nav`
    display: flex;
    align-items: center;
    /* margin-right: -5rem; */

    
    justify-content: flex-end;
    outline: #f04e22;
    
    
    
    @media screen and (max-width: 768px){
        display: none;
    }
`
export const NavBtnLink0 = styled.nav`
    border-radius: 4px;
    background: #fff;
    padding: 10px 22px;
    color: #f04e22;
    border-width: 2px;
    border-style: solid;
    outline: 1px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover{
        transition: all 0.2s ease-in-out;
        background: #f04e22;
        color: #fff;
        
    }


`

export const NavBtn = styled.nav`
    display: flex;
    align-items: center;
    margin-right: 24px;
    justify-content: flex-end;
    
    
    @media screen and (max-width: 768px){
        display: none;
    }
`

export const NavBtnLink = styled.nav`
    border-radius: 4px;
    
    background: #f04e22;
    padding: 10px 22px;
    color: #fff;
    border: solid;
    border-width: 2px;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover{
        border-radius: 4px;
        border-width: 2px;
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #f04e22;
        
    }


`
