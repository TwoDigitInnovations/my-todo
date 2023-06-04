const Jobs = require("../model/jobsModel");
const response = require("../responses");

module.exports = {
  addJobs: async (req, res) => {
    const payload = req.body;
    console.log(payload);
    let job = new Jobs({
      title: payload.title,
      partyname: payload.partyname,
      billno: payload.billno,
      date: payload.date,
      status: payload.status,
      pcs: payload.pcs,
      price: payload.price,
      suittype: payload.suittype,
      pctype: payload.pctype,
      client_id: payload.client_id,
      user_id: payload.user_id,
      Jobcompletedate: payload.Jobcompletedate,
    });

    await job.save();
    return response.created(res, { job });
  },

  getAllJos: async (req, res) => {
    const payload = req.body;
    let startOfCurrentMonth = new Date();
    let startOfNextMonth = new Date();
    let job = [];

    if (payload.type === "all") {
      job = await Jobs.find({
        user_id: payload.user_id,
      });
    } else {
      if (payload.type === "current") {
        startOfCurrentMonth.setDate(0);
        startOfNextMonth.setDate(1);
        startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
      }

      if (payload.type === "last") {
        startOfCurrentMonth.setMonth(startOfNextMonth.getMonth() - 1);
        startOfCurrentMonth.setDate(0);
        startOfNextMonth.setDate(1);
      }

      console.log(startOfCurrentMonth, startOfNextMonth);

      job = await Jobs.find({
        user_id: payload.user_id,
        Jobcompletedate: {
          $gte: startOfCurrentMonth,
          $lt: startOfNextMonth,
        },
      });
    }
    return response.ok(res, job);
  },

  getJobById: async (req, res) => {
    const payload = req.body;
    const job = await Jobs.find({
      _id: payload.job_id,
    });
    return response.ok(res, job);
  },

  updateJob: async (req, res) => {
    const payload = req.body;
    const job = await Jobs.findByIdAndUpdate(payload.job_id, payload, {
      new: true,
      upsert: true,
    });
    return response.ok(res, job);
  },

  addreport: async (req, res) => {
    const payload = req.body;
    const job = await Jobs.findByIdAndUpdate(
      payload.job_id,
      { $push: { report: payload } },
      { new: true, upsert: true }
    );
    return response.created(res, job);
  },

  deleteReport: async (req, res) => {
    const payload = req.body;
    console.log(payload);
    const query = { _id: payload.job_id };
    await Jobs.updateOne(
      query,
      { $pull: { report: { _id: payload._id } } },
      { new: true, upsert: true }
    );
    return response.created(res, {
      message: "Job report deleted successfully!",
    });
  },

  getWorkerJobByStatus: async (req, res) => {
    const payload = req.body;
    const job = await Jobs.find({
      status: payload.status,
      workers: { $elemMatch: { worker_id: payload.worker_id } },
    });
    return response.ok(res, job);
  },

  getWorkerJobBymonth: async (req, res) => {
    const payload = req.body;
    let startOfCurrentMonth = new Date();
    let startOfNextMonth = new Date();
    let job = [];

    if (payload.type === "all") {
      job = await Jobs.find({
        workers: { $elemMatch: { worker_id: payload.worker_id } },
        status: "Complete",
      });
    } else {
      if (payload.type === "current") {
        startOfCurrentMonth.setDate(0);
        startOfNextMonth.setDate(1);
        startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
      }

      if (payload.type === "last") {
        startOfCurrentMonth.setMonth(startOfNextMonth.getMonth() - 1);
        startOfCurrentMonth.setDate(0);
        startOfNextMonth.setDate(1);
      }
      console.log(startOfCurrentMonth, startOfNextMonth);

      job = await Jobs.find({
        workers: { $elemMatch: { worker_id: payload.worker_id } },
        status: "Complete",
        Jobcompletedate: {
          $gte: startOfCurrentMonth,
          $lt: startOfNextMonth,
        },
      });
    }

    return response.ok(res, job);
  },

  getClientJobByStatus: async (req, res) => {
    const payload = req.body;

    const job = await Jobs.find({
      user_id: payload.user_id,
      client_id: payload.client_id,
      status: payload.status,
    });

    return response.ok(res, job);
  },

  getClientJobBymonth: async (req, res) => {
    const payload = req.body;
    let startOfCurrentMonth = new Date();
    let startOfNextMonth = new Date();
    let job = [];

    if (payload.type === "all") {
      job = await Jobs.find({
        client_id: payload.client_id,
        status: "Complete",
      });
    } else {
      if (payload.type === "current") {
        startOfCurrentMonth.setDate(0);
        startOfNextMonth.setDate(1);
        startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
      }

      if (payload.type === "last") {
        startOfCurrentMonth.setMonth(startOfNextMonth.getMonth() - 1);
        startOfCurrentMonth.setDate(0);
        startOfNextMonth.setDate(1);
      }

      console.log(startOfCurrentMonth, startOfNextMonth);

      job = await Jobs.find({
        client_id: payload.client_id,
        status: "Complete",
        Jobcompletedate: {
          $gte: startOfCurrentMonth,
          $lt: startOfNextMonth,
        },
      });
    }

    return response.ok(res, job);
  },

  benifitAmount: async (req, res) => {
    const payload = req.body;
    let startOfCurrentMonth = new Date();
    let startOfNextMonth = new Date();
    let job = [];

    if (payload.type === "all") {
      job = await Jobs.find({
        user_id: payload.user_id,
        status: "Complete",
      }).populate("client_id");
    } else {
      if (payload.type === "current") {
        startOfCurrentMonth.setDate(0);
        startOfNextMonth.setDate(1);
        startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
      }

      if (payload.type === "last") {
        startOfCurrentMonth.setMonth(startOfNextMonth.getMonth() - 1);
        startOfCurrentMonth.setDate(0);
        startOfNextMonth.setDate(1);
      }

      console.log(startOfCurrentMonth, startOfNextMonth);

      job = await Jobs.find({
        user_id: payload.user_id,
        status: "Complete",
        Jobcompletedate: {
          $gte: startOfCurrentMonth,
          $lt: startOfNextMonth,
        },
      }).populate("client_id");
    }
    let formattedJobs = {
      client: [],
      workers: [],
    };
    let grandClientTotal = 0;
    let grandWorkerTotal = 0;

    job.map((j, index) => {
      let client = formattedJobs.client.find(
        (f) => f.name === j.client_id.firm
      );
      grandClientTotal = grandClientTotal + j.pcs * j.price;
      if (client) {
        client.total = client.total + j.pcs * j.price;

        j.workers.map((w) => {
          grandWorkerTotal = grandWorkerTotal + w.pcs * w.rate;
          let worker = formattedJobs.workers.find((f) => f.name === w.fullName);
          if (worker) {
            worker.total = worker.total + w.pcs * w.rate;
            worker.jobs = worker.jobs + 1;
          } else {
            formattedJobs.workers.push({
              name: w.fullName,
              worker_id: w.worker_id,
              total: w.pcs * w.rate,
              jobs: worker?.jobs || 0 + 1,
            });
          }
        });
      } else {
        let jobs = job.filter((f) => f.client_id._id === j.client_id._id);
        formattedJobs.client.push({
          name: j.client_id.firm,
          client_id: j.client_id._id,
          total: j.pcs * j.price,
          jobs: jobs.length,
        });
        j.workers.map((w) => {
          grandWorkerTotal = grandWorkerTotal + w.pcs * w.rate;
          let worker = formattedJobs.workers.find((f) => f.name === w.fullName);
          if (worker) {
            worker.total = worker.total + w.pcs * w.rate;
            worker.jobs = worker.jobs + 1;
          } else {
            formattedJobs.workers.push({
              name: w.fullName,
              worker_id: w.worker_id,
              total: w.pcs * w.rate,
              jobs: 1,
            });
          }
        });
      }
    });

    return response.ok(res, {
      clients: formattedJobs.client,
      workers: formattedJobs.workers,
      grandClientTotal,
      grandWorkerTotal,
    });
  },
};
