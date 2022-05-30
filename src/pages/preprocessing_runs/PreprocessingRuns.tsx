import React, { useEffect, useState, useRef, ReactElement } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { PREPROCESSING_RUNS_ROUTE } from "../../routes";
import { PreprocessingRunInterface, RunInterface } from "../../interfaces";
import PreprocessingRunSelection from "./PreprocessingRunSelection";
import TextNormalization from "./text_normalization/TextNormalization";
import DatasetCleaning from "./dataset_cleaning/DatasetCleaning";

export default function PreprcocessingRuns({
  running,
  continueRun,
  stopRun,
}: {
  running: RunInterface | null;
  continueRun: (run: RunInterface) => void;
  stopRun: () => void;
}): ReactElement {
  const isMounted = useRef(false);
  const history = useHistory();
  const [selectedPreprocessingRun, setSelectedPreprocessingRun] =
    useState<PreprocessingRunInterface | null>(null);

  useEffect(() => {
    if (selectedPreprocessingRun === null) {
      return;
    }
    switch (selectedPreprocessingRun.type) {
      case "textNormalizationRun":
        history.push(
          PREPROCESSING_RUNS_ROUTE.TEXT_NORMALIZATION.CONFIGURATION.ROUTE
        );
        break;
      case "dSCleaningRun":
        history.push(
          PREPROCESSING_RUNS_ROUTE.DATASET_CLEANING.CONFIGURATION.ROUTE
        );
        break;
      default:
        throw new Error(
          `No branch selected in switch-statement, case '${selectedPreprocessingRun.type}' is not a valid case`
        );
    }
  }, [selectedPreprocessingRun]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <Switch>
      <Route
        render={() => (
          <TextNormalization
            preprocessingRun={selectedPreprocessingRun}
            running={running}
            stopRun={stopRun}
            continueRun={continueRun}
          ></TextNormalization>
        )}
        path={PREPROCESSING_RUNS_ROUTE.TEXT_NORMALIZATION.ROUTE}
      ></Route>
      <Route
        path={PREPROCESSING_RUNS_ROUTE.DATASET_CLEANING.ROUTE}
        render={() => (
          <DatasetCleaning
            preprocessingRun={selectedPreprocessingRun}
            continueRun={continueRun}
            running={running}
            stopRun={stopRun}
          ></DatasetCleaning>
        )}
      ></Route>
      <Route
        render={() => (
          <PreprocessingRunSelection
            setSelectedPreprocessingRun={setSelectedPreprocessingRun}
            running={running}
            continueRun={continueRun}
            stopRun={stopRun}
          ></PreprocessingRunSelection>
        )}
        path={PREPROCESSING_RUNS_ROUTE.RUN_SELECTION.ROUTE}
      ></Route>
    </Switch>
  );
}
