import { OverviewInfo, FourYearPlan, ClassSchedule } from "./types";
import axios from "axios";

const URL = "http://127.0.0.1:8000";
// const URL = "http://10.138.219.242:8000";

// TODO: create a new data client, separate user's log in status and token into a different implementation
export class DataClient {
  private loggedIn = false;
  public token: string | undefined;

  public setLoggedInStatus(loggedIn: boolean): void {
    this.loggedIn = loggedIn;
  }

  public setToken(token: string | undefined) {
    // console.log("setting token: ", token);
    this.token = token;
  }

  public async getPlans(): Promise<FourYearPlan[]> {
    return await axios.get(`${URL}/api/plans`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });
  }

  public async searchCourse(code: string): Promise<any> {
    return await axios.get(`${URL}/api/schedules/search-course`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      params: {
        code,
      },
    });
  }

  public async createPlan(data: Omit<FourYearPlan, "id" | "date">) {
    return await axios.post(`${URL}/api/plans/create`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });
  }

  public async editPlan(newPlan: FourYearPlan) {
    return await axios.post(
      `${URL}/api/plans/edit`,
      { ...newPlan },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  public async deletePlan(planId: string) {
    return await axios.post(
      `${URL}/api/plans/delete`,
      { id: planId },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  public async searchClass(code: string) {
    return (
      await axios.get(`${URL}/api/plans/search`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        params: {
          code,
        },
      })
    ).data;
  }

  public async createSchedule({
    name,
    semester,
  }: Omit<ClassSchedule, "id" | "date">) {
    return await axios.post(
      `${URL}/api/schedules/create`,
      { name, semester },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  public async editSchedule(newSchedule: ClassSchedule) {
    return await axios.post(
      `${URL}/api/schedules/edit`,
      { ...newSchedule },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  public async deleteSchedule(scheduleId: string) {
    return await axios.post(
      `${URL}/api/schedules/delete`,
      {
        id: scheduleId,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  public async addClassToPlan(classToAdd: any, plan_id: string) {
    return (
      await axios.post(
        `${URL}/api/plans/add-class`,
        { classToAdd, plan_id },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        },
      )
    ).data;
  }

  public async addClassToSchedule(classToAdd: any, schedule_id: string) {
    return (
      await axios.post(
        `${URL}/api/schedules/add-class`,
        { classToAdd, schedule_id },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        },
      )
    ).data;
  }

  public async deleteClassFromSchedule(classId: string) {
    return await axios.delete(`${URL}/api/schedules/delete-class`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      params: {
        classId,
      },
    });
  }

  public async deleteClassFromPlan(classId: string) {
    return await axios.delete(`${URL}/api/plans/delete-class`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      params: {
        classId,
      },
    });
  }

  public async getSchedule(id: string) {
    return (
      await axios.get(`${URL}/api/schedules/get`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        params: {
          id,
        },
      })
    ).data;
  }

  public async getPlan(id: string) {
    return (
      await axios.get(`${URL}/api/plans/get`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        params: {
          id,
        },
      })
    ).data;
  }

  public async getOverviewInfo(): Promise<OverviewInfo> {
    return (
      await axios.get(`${URL}/api/overview`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      })
    ).data;
  }

  public async getUserInfo(): Promise<OverviewInfo> {
    return (
      await axios.get(`${URL}/api/auth/get-user`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      })
    ).data;
  }

  public async getSemesterPlanModel(major: string): Promise<any> {
    return (
      await axios.get(`${URL}/api/plans/get-semester-model`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        params: {
          major,
        },
      })
    ).data;
  }

  public async generateClasses(codes: any, filters: any): Promise<any> {
    return (
      await axios.post(
        `${URL}/api/schedules/generate`,
        {
          codes,
          filters,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        },
      )
    ).data;
  }

  public async searchUsers(name: string): Promise<any> {
    return (
      await axios.get(`${URL}/api/friends/search`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        params: {
          name,
        },
      })
    ).data;
  }

  public async addFriend(friend_uid: string): Promise<any> {
    return (
      await axios.post(
        `${URL}/api/friends/add`,
        { friend_uid },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        },
      )
    ).data;
  }

  public async getFriends(): Promise<any> {
    return (
      await axios.get(`${URL}/api/friends/get`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      })
    ).data;
  }

  public async getRequests(): Promise<any> {
    return (
      await axios.get(`${URL}/api/friends/requests`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      })
    ).data;
  }

  public async acceptRequest(friend_uid: string): Promise<any> {
    return (
      await axios.post(
        `${URL}/api/friends/accept`,
        { friend_uid },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        },
      )
    ).data;
  }

  public async getFriendInfo(friend_uid: any): Promise<any> {
    return (
      await axios.get(`${URL}/api/friends/get-info`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        params: {
          friend_uid,
        },
      })
    ).data;
  }
}

export const dataClient = new DataClient();
