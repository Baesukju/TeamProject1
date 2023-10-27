
//지민님 코드

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import './GuestInfo.css';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

class TreeNode {
    constructor(name, email, phoneNumber, date) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.date = date;
        this.children = null;
        this.sibling = null; 
    }
}

class Tree{
    constructor(){
        this.head = null;
    }
}
function addNodeInRange(tree, name, email, phoneNumber, startDate, endDate) {
    const currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    currentDate.setDate(currentDate.getDate() + 1);
    endDateObj.setDate(endDateObj.getDate() + 1);

    while (currentDate <= endDateObj) {
        const newNode = new TreeNode(name, email, phoneNumber, new Date(currentDate).toJSON());
        if (!tree.head) {
            //tree.head = newNode;
            tree.head = new TreeNode( null, null, null , new Date("1970-01-01T00:00:00.000Z").toJSON());
        } else {
            let current = tree.head;
            let parent = null;

            while (current) {
                // 날짜 비교를 통해 형제 노드 또는 자식 노드로 추가
                if (current.date < newNode.date) {
                    if (!current.children){
                        current.children = newNode;
                        break;
                    }else {
                        parent = current;
                        current = current.children;
                    }
                } else if (current.date > newNode.date) {
                    //newNode.sibling = current;
                    if (parent) {
                        newNode.children = parent.children;
                        parent.children = newNode;
                    } else {
                        newNode.children = tree.head;
                        tree.head = newNode;
                    }
                    break;
                } else {
                    // 날짜가 같은 경우, 형제 노드로 추가
                    newNode.sibling = current.sibling;
                    current.sibling = newNode;
                    break;
                }
            }
        }

        currentDate.setDate(currentDate.getDate() + 1); // 다음 날짜로 이동
    }
}

function GuestInfo() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    
    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

   


    // handleSubmit 함수는 완료 버튼을 클릭할 때 실행
    const handleSubmit = () => {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        //const tree = userData.tree;
        
        if (!userData.tree) {
           
            userData.tree = new Tree();
        }
        
        addNodeInRange(userData.tree, name, email, phoneNumber, startDate, endDate);
        

        localStorage.setItem('userData', JSON.stringify(userData));
        console.log(userData.tree);
        // 데이터를 저장한 후 필요에 따라 다른 작업 수행 가능]
        //localStorage.clear();
        setName('');
        setEmail('');
        setPhoneNumber('');
        setStartDate(null);
        setEndDate(null);
    }

    return (
        <div>
            <Header />
            <div className="content container">
                <input
                    type="text"
                    className="form-control input-box"
                    placeholder="이름 입력"
                    value={name}
                    onChange={handleNameChange}
                />
                <input
                    type="email"
                    className="form-control input-box"
                    placeholder="이메일 입력"
                    value={email}
                    onChange={handleEmailChange}
                />
                <input
                    type="tel"
                    className="form-control input-box"
                    placeholder="전화번호 입력"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                />
                <label>참여 가능한 기간을 입력해주세요</label>
                <div className="date-range">
                    <DatePicker
                        placeholderText="언제부터"
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                    />
                    <DatePicker
                        placeholderText="언제까지"
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                    />
                </div>
                <Link to="/List">
                    <button className="btn btn-success submit-btn" onClick={handleSubmit}>
                        완료
                    </button>
                </Link>
            </div>
            <Footer />
        </div>
    );
}

export default GuestInfo;