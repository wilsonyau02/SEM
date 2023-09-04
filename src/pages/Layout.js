import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

function PageLayout(){

    const [currentKey, setCurrentKey] = useState('/');

    const navigate = useNavigate();

    const items = [
        {
            key: '/home',
            label: 'Home',
        },
        {
            key: '/application',
            label: 'Application',
        },
        {
            key: '/academician',
            label: 'Academician'
        },
        {
            key: '/help',
            label: 'Help',
        },
    ];

    const handleClick = (e) => {
        setCurrentKey(e.key);
        navigate(e.key);
    }



    return (
        <>
            <Layout>
                <Header>
                    <Menu
                        defaultSelectedKeys={[currentKey]}
                        onClick={handleClick}
                        items={items}
                        mode='horizontal'
                        style={{
                            width: '100%',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                        }}
                        />
                </Header>
                <Content style={{backgroundColor: 'white'}}>
                    <Outlet />
                </Content>
                {/* <Footer>Footer</Footer> */}
            </Layout>
        </>
    )

}

export default PageLayout;