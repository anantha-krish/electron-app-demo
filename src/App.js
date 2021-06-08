import { useEffect, useState } from "react";
import { channels, constants } from "./shared/Constants";
import "./App.scss";

let ipcRenderer = window.ipcRenderer;

export default () => {
  const [appInfo, setappInfo] = useState("");
  const [cpuUsage, setcpuUsage] = useState("");
  const [memUsage, setmemUsage] = useState("");
  const [totalMem, settotalMem] = useState("");
  const [fileData, setfileData] = useState("");

  const getAppinfo = () => {
    ipcRenderer.send(channels.APP_VERSION, constants.GET_APP_VERSION);
    ipcRenderer.once(channels.APP_VERSION, (event, { version }) => {
      setappInfo(version);
    });
  };

  const getFileData = () => {
    ipcRenderer.send(channels.FILE_DATA, constants.GET_FILE_DATA);
    ipcRenderer.once(channels.FILE_DATA, (event, data) => {
      setfileData(data);
    });
  };

  const getSysInfo = () => {
    setInterval(() => {
      ipcRenderer.send(channels.SYS_INFO, constants.GET_SYS_INFO);
      ipcRenderer.once(channels.SYS_INFO, (event, data) => {
        setcpuUsage(data.cpuUsage);
        setmemUsage(data.memUsage);
        settotalMem(data.totalMem);
      });
    }, 1000);
  };
  useEffect(() => {
    getAppinfo();
    getSysInfo();
    getFileData();
  }, []);

  return (
    <>
      <div className="app-screen">
        <h1 className="app-screen__heading">Electron Demo App</h1>
        <div className="app-screen__version">
          App version <span>{appInfo}</span>
        </div>
        <ul className="sys-info">
          <li className="sys-info__item">
            CPU Usage: <span>{cpuUsage}%</span>
          </li>
          <li className="sys-info__item">
            Free Memory:<span>{memUsage}%</span>
          </li>
          <li className="sys-info__item">
            Total Memory:<span>{totalMem} GB</span>
          </li>
        </ul>
        <div className="file-data">
          <textarea
            name=""
            id=""
            cols="70"
            rows="20"
            value={fileData}
            readOnly
          />
          <button className="refresh-btn" onClick={getFileData}>
            Refresh Content
          </button>
        </div>
        <footer>Designed by &copy;<span>Anantha Krishnan M</span></footer>
      </div>
    </>
  );
};
