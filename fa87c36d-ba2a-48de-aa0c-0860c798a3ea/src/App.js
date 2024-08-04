import * as React from "react";
import { useEffect, useState } from "react";
import "./styles.css";
import { Modal, Button } from "react-bootstrap";

import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from "@table-library/react-table-library/table";
import {
  useSort,
  HeaderCellSort,
  SortIconPositions,
  SortToggleType,
} from "@table-library/react-table-library/sort";

const App = () => {
  const [users, setUsers] = useState([]);
  const data = { nodes: users };
  const theme = useTheme(getTheme());

  //Модальное окно:
  const [showM, set_Show_M] = useState(false);
  const [modalData, set_Modal_Data] = useState("");
  const modalShow = () => {
    set_Show_M(true);
  };
  const closeModal = () => {
    set_Show_M(false);
  };
  const openModalHandle = () => {
    //set_Modal_Data(modalContent);
    modalShow();
  };

  //Фильтр / поиск:
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    //поиск
    setSearch(event.target.value);
  };

  useEffect(() => {
    //загрузка данных с пом-ю fetch
    const fetchata = async () => {
      const response = await fetch("https://dummyjson.com/users");
      const data = await response.json();

      setUsers(data.users);
      console.log(data.users);
    };

    // Call the function
    fetchata();
  }, []);

  //СОРТИРОВКА:
  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortToggleType: SortToggleType.AlternateWithReset,
      sortFns: {
        FIO: (array) =>
          array.sort((a, b) => a.firstName.localeCompare(b.firstName)),
        AGE: (array) => array.sort((a, b) => a.age - b.age),
        GENDER: (array) =>
          array.sort((a, b) => a.gender.localeCompare(b.gender)),
        NUMBER: (array) => array.sort((a, b) => a.phone - b.phone),
        ADDRESS: (array) =>
          array.sort((a, b) => a.address.localeCompare(b.address)),
      },
    }
  );

  function onSortChange(action, state) {
    console.log(action, state);
  }

  let modalContent = {}; //здесь будут наши данные для модального окна

  //обработка нажатия по строке:
  const handleClick = (e) => {
    //Содержимое для модального окна:
    modalContent.age = e.age;
    modalContent.fio = e.firstName + " " + e.lastName + " " + e.maidenName;
    modalContent.phone = e.phone;
    modalContent.address = e.address.city + ", " + e.address.address;
    //console.log(modalContent);

    set_Modal_Data(modalContent); //обновляем данные для модального окна
    //console.log(modalData);
    openModalHandle();
  };

  return (
    <div className="App">
      <h1>Список пользователей</h1>

      <label htmlFor="search">
        Поиск:
        <input id="search" type="text" onChange={handleSearch} />
      </label>

      <Table className="table" data={data} theme={theme} sort={sort}>
        {(tableList) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCellSort
                  sortKey="FIO"
                  resize={{ minWidth: 50 }}
                  className="header"
                >
                  ФИО
                </HeaderCellSort>
                <HeaderCellSort
                  sortKey="AGE"
                  resize={{ minWidth: 50 }}
                  className="header"
                >
                  Возраст
                </HeaderCellSort>
                <HeaderCellSort
                  sortKey="GENDER"
                  resize={{ minWidth: 50 }}
                  className="header"
                >
                  Пол
                </HeaderCellSort>
                <HeaderCellSort
                  sortKey="NUMBER"
                  resize={{ minWidth: 50 }}
                  className="header"
                >
                  Номер телефона
                </HeaderCellSort>
                <HeaderCellSort sortKey="ADDRESS" className="header">
                  Адрес
                </HeaderCellSort>
              </HeaderRow>
            </Header>
            <Body>
              {tableList
                .filter(
                  (item) =>
                    item.firstName.includes(search) ||
                    item.lastName.includes(search) ||
                    item.maidenName.includes(search) ||
                    item.age.toString().includes(search) ||
                    item.gender.includes(search) ||
                    item.phone.includes(search) ||
                    item.address.city.includes(search) ||
                    item.address.address.includes(search)
                )
                .map((user) => (
                  <Row key={user.id} item={user} onClick={handleClick}>
                    <Cell className="table-data">
                      {user.firstName +
                        " " +
                        user.lastName +
                        " " +
                        user.maidenName}
                    </Cell>
                    <Cell className="table-data">{user.age.toString()}</Cell>
                    <Cell className="table-data">{user.gender}</Cell>
                    <Cell className="table-data">{user.phone}</Cell>
                    <Cell className="table-data">
                      {user.address.city + ", " + user.address.address}
                    </Cell>
                  </Row>
                ))}
            </Body>
          </>
        )}
      </Table>
      <Modal show={showM} onHide={closeModal} className="Modal">
        <Modal.Header>
          <Modal.Title>
            <b>
              <h2>Информация о пользователе:</h2>
            </b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              <b> ФИО:</b> {modalData.fio} <br></br>
              <b> Возраст:</b> {modalData.age} <br></br>
              <b> Адрес:</b> {modalData.address}
              <br></br>
              <b> Рост:</b> {modalData.height}
              <br></br>
              <b> Вес:</b> {}
              <br></br>
              <b> Телефон:</b> {modalData.phone}
              <br></br>
              <b> E-mail:</b> {modalData.email}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeModal}
            className="text-danger"
          >
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
