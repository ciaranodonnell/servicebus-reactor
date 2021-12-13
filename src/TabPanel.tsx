import React, { Children, ReactNode } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ReactDOM from "react-dom";


type TabControlProps = React.PropsWithChildren<{ tabGroupName: string, onChange?: (newValue: number) => void }>;

type TabProps = React.PropsWithChildren<{ title: string }>;

class TabPanel extends React.Component<TabProps> {
    get title() { return this.props.title; }
    get children() { return this.props.children; }
    render() { return (<div>{this.props.children}</div>); }
}

function TabControl(props: TabControlProps): JSX.Element {
    const tabGroupName = props.tabGroupName;
    const { onChange, ...other } = props;
    const [selectedTab, setSelectedTab] = React.useState(0);

    let tabs: TabPanel[] = [];

    React.Children.map(props.children, (child: React.ReactNode) => {

        if ((child as any).type.name == "TabPanel") {
            tabs.push(child as TabPanel);
        } else {
            //       console.log("skipped a child", child instanceof TabPanel);
            //     console.log(child)
        }
    });


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };
    function a11yProps(index: number) {
        return {
            id: `simple-tab-${tabGroupName}-${index}`,
            'aria-controls': `simple-tabpanel-${tabGroupName}-${index}`,
        };
    }

    function writeTabsPanels(child: TabPanel, index: number) {
        const isSelected = selectedTab == index;
        const divId = `simple-tabpanel-${index}`;
        // console.log("writing tab panel", index, child, "isSelected", isSelected);
        return (
            <div
                role="tabpanel"
                hidden={!isSelected}
                id={divId}
                key={divId}
                aria-labelledby={`simple-tab-${tabGroupName}-${index}`}
            >
                {isSelected ? (
                    <Box sx={{ p: 3 }}>
                        <Typography>
                            {child.props.children}
                        </Typography>
                    </Box>
                ) : (<></>)}
            </div>
        );
    }

    //  console.log("Tab Count", tabs.length);
    //  console.log("Selected Tab", selectedTab);
    return (

        <Box className="thisIsTheBox" {...other}>
            <Tabs value={selectedTab} onChange={handleChange} variant="fullWidth" >
                {tabs.map((child, index) => {
                    //  console.log("Tab", child.props.title, index);
                    return (<Tab key={index} {...a11yProps(index)} label={child.props.title} />);
                })}
            </Tabs>
            {tabs.map((child, index) => {
                return writeTabsPanels(child, index);
            })}
        </Box>
    );
}

export { TabPanel, TabControl };