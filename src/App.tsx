import { Layout } from "antd";
import "antd/dist/antd.css";

import _ from "lodash";
import React, { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import FloorPlan, { deskTags } from "./components/FloorPlan";
import Navigation from "./components/Navigation";
import UsersList from "./components/UsersList";
import { DEFAULT_SCENE_ID } from "./shared/constants";
import { IFloor } from "./shared/services/FloorService";
import UserService, {
  IDeskAssignment,
  IUserElement,
} from "./shared/services/UserService";

const App = () => {
  const { Sider, Content } = Layout;
  const urlParams = new URLSearchParams(window.location.search);
  const sceneId = urlParams.get("floorId") || DEFAULT_SCENE_ID;

  const [users, setUsers] = useState<Array<IUserElement>>([]);
  const [deskAssignments, setDeskAssignments] = useState<
    Array<IDeskAssignment>
  >([]);
  const [loading, isLoading] = useState<boolean>(false);
  const [deskAssignment, addDeskAssignment] = useState<IDeskAssignment>();
  const [removedDeskAssignment, removeDeskAssignment] =
    useState<IDeskAssignment>();
  const [floor] = useState<IFloor>();

  useEffect(() => {
    if (!sceneId) return;

    isLoading(true);

    // load users
    setUsers(UserService.getAll());
  }, [sceneId]);

  useEffect(() => {
    // remove desk assignment
    if (!removedDeskAssignment) return;

    setUsers(
      users?.map((stateUser) => {
        return stateUser.id === removedDeskAssignment.userId
          ? { ...stateUser, isLoading: true }
          : stateUser;
      })
    );
    setDeskAssignments(
      deskAssignments.filter((item) => {
        return item.deskId !== removedDeskAssignment.deskId;
      })
    );
    setUsers(
      users?.map((stateUser) => {
        return stateUser.id === removedDeskAssignment.userId
          ? { ...stateUser, isLoading: false }
          : stateUser;
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removedDeskAssignment]);

  useEffect(() => {
    // add desk assignment
    if (!deskAssignment) return;

    // check if the desk was taken to clear out previous assignment
    const assignmentToReplace = _.find(deskAssignments, (item) => {
      return String(item.deskId) === String(deskAssignment.deskId);
    });

    setUsers(
      users?.map((stateUser) => {
        return stateUser.id === deskAssignment.userId
          ? { ...stateUser, isLoading: true }
          : stateUser;
      })
    );

    // add assignment
    if (assignmentToReplace) {
      setDeskAssignments(
        deskAssignments
          .filter((item) => {
            return item.deskId !== assignmentToReplace.deskId;
          })
          .concat(deskAssignment)
      );
    } else {
      setDeskAssignments(deskAssignments.concat(deskAssignment));
    }

    setUsers(
      users?.map((stateUser) => {
        return stateUser.id === deskAssignment.userId
          ? { ...stateUser, isLoading: false, isDragging: false }
          : stateUser;
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deskAssignment]);

  return (
    <div className="App">
      <Layout>
        <Sider>
          <Navigation floor={floor} />
          <hr />
          <UsersList
            users={users}
            deskAssignments={deskAssignments}
            sceneId={sceneId}
            setUsers={setUsers}
            removeDeskAssignment={removeDeskAssignment}
            loading={loading}
          />
        </Sider>
        <Layout>
          <Content>
            <FloorPlan
              sceneId={sceneId}
              deskAssignments={deskAssignments}
              addDeskAssignment={addDeskAssignment}
              removedDeskAssignment={removedDeskAssignment}
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
