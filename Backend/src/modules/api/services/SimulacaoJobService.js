const { spawn } = require("child_process");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const jobs = new Map();
const JOB_TTL_MS = 15 * 60 * 1000;

function scheduleJobCleanup(jobId) {
  setTimeout(() => {
    jobs.delete(jobId);
  }, JOB_TTL_MS);
}

function getSimulationPaths() {
    const localVenvPython = path.resolve(
        __dirname,
        "../../../../engine/venv/Scripts/python.exe"
    );

    const dockerVenvPython = path.resolve(
        __dirname,
        "../../../../engine/venv/bin/python"
    );

    let pythonBin = process.env.PYTHON_BIN;

    if (!pythonBin && fs.existsSync(localVenvPython)) {
        pythonBin = localVenvPython;
    }

    if (!pythonBin && fs.existsSync(dockerVenvPython)) {
        pythonBin = dockerVenvPython;
    }

    if (!pythonBin) {
        pythonBin = "python";
    }

  const scriptPath = path.resolve(
    __dirname,
    "../../../../engine/data_pipeline/simulation/teste_de_argparse.py"
  );

  const csvPath = path.resolve(
    __dirname,
    "../../../../data/raw/calculo-emissao-poluentes-diario_2026-01-01_silver.csv"
  );

  return {
    pythonBin,
    scriptPath,
    csvPath,
  };
}

function getSimulationStatus() {
  const { pythonBin, scriptPath, csvPath } = getSimulationPaths();

  return {
    modo: "simulacao-dinamica",
    salvaHistorico: false,
    pythonConfigurado: Boolean(pythonBin),
    scriptEncontrado: fs.existsSync(scriptPath),
    csvEncontrado: fs.existsSync(csvPath),
    pythonBin,
    scriptPath,
    csvPath,
  };
}

function createJob({ onibus, dias }) {
  const jobId = crypto.randomUUID();

  const job = {
    jobId,
    status: "queued",
    createdAt: new Date().toISOString(),
    finishedAt: null,
    result: null,
    error: null,
  };

  jobs.set(jobId, job);

  runSimulationJob(jobId, { onibus, dias });

  return job;
}

function getJob(jobId) {
  return jobs.get(jobId);
}

function runSimulationJob(jobId, { onibus, dias }) {
  const job = jobs.get(jobId);
  if (!job) return;

  job.status = "running";
  jobs.set(jobId, job);

  const { pythonBin, scriptPath, csvPath } = getSimulationPaths();

  const python = spawn(pythonBin, [
    scriptPath,
    "--onibus",
    String(onibus),
    "--dias",
    String(dias),
    "--csv",
    csvPath,
  ]);

  let stdout = "";
  let stderr = "";

  python.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  python.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  python.on("close", (code) => {
    const currentJob = jobs.get(jobId);
    if (!currentJob) return;

    currentJob.finishedAt = new Date().toISOString();

    if (code !== 0) {
      currentJob.status = "error";
      currentJob.error = stderr || `Python finalizou com código ${code}`;
      jobs.set(jobId, currentJob);
      scheduleJobCleanup(jobId);
      return;
    }

    try {
      const parsed = JSON.parse(stdout);

      if (!parsed.sucesso) {
        currentJob.status = "error";
        currentJob.error = parsed.erro || "Erro retornado pelo Python.";
        currentJob.result = parsed;
        jobs.set(jobId, currentJob);
        scheduleJobCleanup(jobId);
        return;
      }

      currentJob.status = "done";
      currentJob.result = parsed.dados;
      jobs.set(jobId, currentJob);
      scheduleJobCleanup(jobId);
    } catch (err) {
      currentJob.status = "error";
      currentJob.error = `Python não retornou JSON válido: ${err.message}`;
      currentJob.result = stdout;
      jobs.set(jobId, currentJob);
      scheduleJobCleanup(jobId);
    }
  });

  python.on("error", (err) => {
    const currentJob = jobs.get(jobId);
    if (!currentJob) return;

    currentJob.status = "error";
    currentJob.error = `Erro ao iniciar o Python: ${err.message}`;
    currentJob.finishedAt = new Date().toISOString();

    scheduleJobCleanup(jobId);
    jobs.set(jobId, currentJob);
  });
}

module.exports = {
  createJob,
  getJob,
  getSimulationStatus,
};