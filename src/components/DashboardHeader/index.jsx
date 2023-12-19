import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import ReactModal from 'react-modal';
import './styles.css';
import CloseIcon from '../../assets/icons/icons8-close-50.svg';
import useAuth from '../../context/userContext';
import { changePassword } from '../../services/device.Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function DashboardHeader({ btnText, onClick }) {
    const [open, setOpen] = React.useState(false);
    const [openChangePassword, setOpenChangePassword] = React.useState(false);
    const anchorRef = React.useRef(null);
    const { logOut } = useAuth();
    const [formData, setFormData] = useState({
        userName: "",
        oldPassword: '',
        newPassword: '',
    });

    const handleInputChange = (e) => {

        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        // console.log("formData :: ", formData);

        const response = await changePassword(formData);
        // console.log("response :: ", response);
        if (response.success) {
            toast.success(response.message, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeonClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            logOut();
        } else {
            toast.error(response.message, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeonClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        // Clear the form input values
        setFormData({
            userName: 'admin2023',
            oldPassword: '',
            newPassword: '',
        });
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setFormData((prev) => {
                return {
                    ...prev,
                    userName: JSON.parse(storedUser).data
                }
            });
        }
    }, []);

    return (
        <>
            <div className='dashbord-header-container'>

                <div className='dashbord-header-right'>
                    <Stack direction="row" spacing={2} >
                        <div className='dashbord-header-dropdown'>
                            <Button
                                ref={anchorRef}
                                id="composition-button"
                                aria-controls={open ? 'composition-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleToggle}
                            >
                                <img
                                    alt=''
                                    className='dashbord-header-avatar'
                                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq2k2sI1nZyFTtoaKSXxeVzmAwIPchF4tjwg&usqp=CAU'
                                />
                            </Button>
                            <Popper
                                open={open}
                                anchorEl={anchorRef.current}
                                role={undefined}
                                placement="bottom-start"
                                transition
                                disablePortal
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin:
                                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                                        }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList
                                                    autoFocusItem={open}
                                                    id="composition-menu"
                                                    aria-labelledby="composition-button"
                                                    onKeyDown={handleListKeyDown}
                                                >
                                                    <MenuItem onClick={() => setOpenChangePassword(true)} data-toggle="modal" data-target="#exampleModalCenter">Change Password</MenuItem>
                                                    <MenuItem onClick={async () => await logOut()}>Logout</MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>
                    </Stack>
                </div>
            </div>
            {/* <!-- Modal --> */}
            <ReactModal
                isOpen={openChangePassword}
                contentLabel="Minimal Modal Example"

                style={{
                    overlay: {
                        border: "0px",
                        backgroundColor: 'rgba(0,0,0,0.50)',
                        color: 'transparent',
                    },

                    content: {
                        border: "0px",
                        backgroundColor: 'transparent',
                        color: 'transparent',
                    }
                }}
            >
                <div class="mainDiv">
                    <div class="cardStyle">
                        <div className='closeIcon'>
                            <img
                                src={CloseIcon}
                                onClick={() => setOpenChangePassword(false)}
                                alt='close Icon' />
                        </div>
                        <form action="" method="post" name="signupForm" id="signupForm" onSubmit={handleChangePassword}>
                            <h2 class="formTitle">Change Password</h2>
                            <div class="inputDiv">
                                <label class="inputLabel" for="password">Old Password</label>
                                <input type="password" id="password" name="oldPassword" value={formData.oldPassword} required onChange={handleInputChange} />
                            </div>
                            <div class="inputDiv">
                                <label class="inputLabel" for="confirmPassword">New Password</label>
                                <input type="password" id="confirmPassword" name="newPassword" value={formData.newPassword} onChange={handleInputChange} />
                            </div>
                            <div class="buttonWrapper">
                                <button type="submit" id="submitButton" class="submitButton pure-button pure-button-primary">
                                    <span>Continue</span>
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            </ReactModal>
            <ToastContainer />

        </>
    )
}

export default DashboardHeader;