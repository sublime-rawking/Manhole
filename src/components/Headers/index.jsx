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
            </Row>
          </div>
        </Container >
      </div >
    </>
  );
};

export default Header;
