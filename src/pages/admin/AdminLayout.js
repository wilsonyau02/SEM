import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
    Layout,
    Button,
    Menu,
    Image,
} from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase-client';
import { BiLogOutCircle } from 'react-icons/bi';
import { SiGoogleforms } from 'react-icons/si';
import { MdQuestionAnswer } from 'react-icons/md';
import { LuHistory } from 'react-icons/lu';
import logo from '../../images/tarumtLogo.png';
import cropLogo from '../../images/tarumtCropLogo.png';
import './AdminLayout.css';


const { Sider } = Layout;

function AdminLayout() {

    const { Header, Content } = Layout;
    const location = useLocation();
    const navigate = useNavigate();


    const [collapsed, setCollapsed] = useState(false);
    const [title, setTitle] = useState('Dashboard');
    const [selectedKey, setSelectedKey] = useState(localStorage.getItem('selectedKey') || '/admin');



    const handleCollapsed = () => {
        setCollapsed(!collapsed)
    }

    const handleTitle = (newTitle) => {
        switch (newTitle) {
            case '/admin':
                setTitle('Application')
                break;
            case '/admin/enquiry':
                setTitle("Student's Enquiry")
                break;
            case '/admin/activityLog':
                setTitle("Student's Activity Log")
                break;
        }
    }

    useEffect(() => {
        handleTitle(location.pathname);
    }, [location.pathname]);


    return <>

        <Layout className="adminLayout" >

            <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={90} width={220} className='menuSidebar'
                style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    height: '100%',
                    overflowY: 'auto',
                    zIndex: '100',
                }}>
                <Menu
                    // theme="light"
                    mode="inline"
                    defaultSelectedKeys={[selectedKey]}
                    selectedKeys={[selectedKey]}
                    style={{
                        backgrounfdColor: '#eea500',
                        height: '100%',
                        overflowY: 'auto',
                    }}
                    onClick={async ({ key }) => {
                        if (key === '/logout') {
                            await supabase.auth.signOut();
                            localStorage.removeItem('selectedKey');
                            navigate('/');
                            return;
                        } else {
                            setSelectedKey(key);
                            localStorage.setItem('selectedKey', key);
                            setTitle(key)
                            navigate(key)
                        }
                    }}
                    items={[
                        {
                            key: 'logo',
                            icon: (collapsed ? 
                                <Image width={40} height={50} src={cropLogo} preview={false} style={{ marginLeft: '-10px', marginTop: '15px' }} />
                                :
                                <Image width={180} height={50} src={logo} preview={false} style={{ marginLeft: '-10px', marginTop: '10px'}} /> ),
                            // label: <span style={{ marginLeft: '10px', fontSize: '20px', color: 'black' }}>EzRent</span>,
                            style: { height: '70px' },
                            disabled: "true",
                        },
                        {
                            key: '/admin',
                            icon: <SiGoogleforms style={{ width: '25px', height: 'auto' }} />,
                            label: 'Application',
                        },
                        {
                            key: '/admin/enquiry',
                            icon: <MdQuestionAnswer style={{ width: '25px', height: 'auto' }} />,
                            label: 'Enquiry',
                        },
                        {
                            key: '/admin/activityLog',
                            icon: <LuHistory style={{ width: '25px', height: 'auto' }} />,
                            label: 'Activity Log',
                        },
                        {
                            key: '/logout',
                            icon: <BiLogOutCircle style={{ width: '25px', height: 'auto' }} />,
                            style: { position: 'absolute', bottom: '0', width: '95%' },
                            label: 'Logout',
                        },
                    ]}
                />
            </Sider>

            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginLeft: (!collapsed ? '250px' : '110px'),
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={handleCollapsed}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <h1 style={{ display: 'block', margin: '0 auto', marginInlineStart: '0px', fontSize: '20px' }}>{title}</h1>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: "80vh",
                        marginLeft: (!collapsed ? '250px' : '110px'),
                        background: '#fff',
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    </>
}

export default AdminLayout;