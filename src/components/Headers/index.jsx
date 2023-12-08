// reactstrap components
import { Card, Container, Row } from "reactstrap";

const Header = (props) => {
  const { activeUser, inActiveUser, tripCount, orderCount } = props.data;
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-md-8">
        <Container fluid>
          <div className="header-body" >
            {/* Card stats */}
            <Row>

              <Card className="card-stats mx-4 p-2" style={{width:"15%", height: "fit-content" }}>
                <span className="text-uppercase text-muted fs-6">
                  Active Users
                </span>
                <span className=" font-weight-bold  fs-4">
                  {activeUser}
                </span>
              </Card>
              <Card className="card-stats mx-4 p-2" style={{width:"15%", height: "fit-content" }}>
                <span className="text-uppercase text-muted fs-6">
                  In-Active Users
                </span>
                <span className=" font-weight-bold  fs-4">
                  {inActiveUser}
                </span>
              </Card>
              <Card className="card-stats mx-4 p-2" style={{width:"15%", height: "fit-content" }}>
                <span className="text-uppercase text-muted fs-6">
                  Trips
                </span>
                <span className=" font-weight-bold  fs-4">
                  {tripCount}
                </span>
              </Card>
              <Card className="card-stats mx-4 p-2" style={{width:"15%", height: "fit-content" }}>
                <span className="text-uppercase text-muted fs-6">
                  Orders
                </span>
                <span className=" font-weight-bold  fs-4">
                  {orderCount}
                </span>
              </Card>
              {/* <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 ">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle className="text-uppercase text-muted mb-0 fs-6">
                          In-Active Users
                        </CardTitle>
                        <span className="font-weight-bold mb-0 fs-4">
                          {inActiveUser}
                        </span>
                      </div>

                    </Row>

                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle className="text-uppercase text-muted mb-0 fs-6">
                          Trips
                        </CardTitle>
                        <span className="font-weight-bold mb-0 fs-4">
                          {tripCount}
                        </span>
                      </div>

                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle className="text-uppercase text-muted mb-0 fs-6">
                          Orders
                        </CardTitle>
                        <span className="font-weight-bold mb-0 fs-4">
                          {orderCount}
                        </span>
                      </div>

                    </Row>

                  </CardBody>
                </Card>
              </Col> */}
            </Row>
          </div>
        </Container >
      </div >
    </>
  );
};

export default Header;
