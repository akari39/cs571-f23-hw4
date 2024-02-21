import { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col, Pagination } from "react-bootstrap";

const Classroom = () => {
    const MAX_PAGE_ITEMS_COUNT = 24;
    const [students, setStudents] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchMajor, setSearchMajor] = useState("");
    const [searchInterest, setSearchInterest] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetchStudentsData();
    }, []);

    useEffect(() => {
        fetchStudentsData();
    }, [searchName, searchMajor, searchInterest]);

    async function fetchStudentsData() {
        const data = await (await fetch("https://cs571.org/api/f23/hw4/students", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })).json();
        console.log(data);
        setStudents(search(data));
        setIndex(0);
    }

    function search(data) {
        if (searchName.length === 0 && searchMajor.length === 0 && searchInterest.length === 0) {
            return data;
        }
        let searchedData = [];
        for (const student of data) {
            const studentFirstName = student.name.first.toLowerCase().replace(' ', '');
            const studentLastName = student.name.last.toLowerCase().replace(' ', '');
            const studentName = studentFirstName + studentLastName;
            if (searchName.length > 0) {
                if (!studentFirstName.includes(searchName) && !studentLastName.includes(searchName) && !studentName.includes(searchName)) {
                    continue;
                }
            }
            const studentMajor = student.major.toLowerCase().replace(' ', '');
            if (searchMajor.length > 0) {
                if (!studentMajor.includes(searchMajor)) {
                    continue;
                }
            }
            const studentInterests = student.interests;
            if (searchInterest.length > 0) {
                let isMatch = false;
                for (const studentInterest of studentInterests) {
                    const studentInterestLowerCase = studentInterest.toLowerCase().replace(' ', '');
                    if (studentInterestLowerCase.includes(searchInterest)) {
                        isMatch = true;
                        break;
                    }
                }
                if (!isMatch) {
                    continue;
                }
            }
            searchedData.push(student);
        }
        return searchedData;
    }

    const displayStudents = students.slice(index * MAX_PAGE_ITEMS_COUNT, index * MAX_PAGE_ITEMS_COUNT + MAX_PAGE_ITEMS_COUNT);
    const indexCount = Math.ceil(students.length / MAX_PAGE_ITEMS_COUNT);

    return <div>
        <h1>Badger Book - Fall 2023</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control id="searchName" value={searchName} onChange={(event) => {
                event.preventDefault();
                setSearchName(event.target.value);
            }} />
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control id="searchMajor" value={searchMajor} onChange={(event) => {
                event.preventDefault();
                setSearchMajor(event.target.value);
            }} />
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control id="searchInterest" value={searchInterest} onChange={(event) => {
                event.preventDefault();
                setSearchInterest(event.target.value);
            }} />
            <br />
            <Button variant="neutral">Reset Search</Button>
            <p>There are {students.length} student(s) matching your search.</p>
        </Form>
        <Container fluid>
            <Row>
                {
                    displayStudents.map((stud) => {
                        return <Col xs={12} sm={6} md={4} lg={3} xl={2}>
                            <h2>{stud.name.first} {stud.name.last}</h2>
                            <p><b>{stud.major}</b></p>
                            <p>{stud.name.first} is taking {stud.numCredits} and is {stud.fromWisconsin ? '' : 'not'} from Wisconsin.</p>
                            <p>They have {stud.interests.length} including...</p>
                            <ul>
                                {stud.interests.map((interest) => {
                                    return <li>{interest}</li>;
                                })}
                            </ul>
                        </Col>;
                    })
                }
            </Row>
        </Container>
        <Pagination>
            <Pagination.Item active={false} disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</Pagination.Item>
            {
                Array.from(Array(indexCount).keys()).map((pageIndex) => {
                    return <Pagination.Item active={index === pageIndex} onClick={() => setIndex(pageIndex)}>{pageIndex + 1}</Pagination.Item>;
                })
            }
            <Pagination.Item active={false} disabled={index === indexCount - 1} onClick={() => setIndex(index + 1)}>Next</Pagination.Item>
        </Pagination>
    </div>

}

export default Classroom;