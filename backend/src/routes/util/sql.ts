import sql from "sql-template-tag";

export const triggers = sql`--sql 
DELIMITER /
CREATE TRIGGER update_objectives
AFTER UPDATE ON objectives
FOR EACH ROW
BEGIN
    IF(OLD.status = 'draft' AND NEW.status = 'OK') THEN
            INSERT INTO updates (employeeId, updateType) VALUES (NEW.employeeId, 'OBJECTIVE_SUBMIT');
    END IF;
END;
/`;
