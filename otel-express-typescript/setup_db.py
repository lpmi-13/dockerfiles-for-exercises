from superset.app import create_app
from superset.extensions import db
from superset.models.core import Database
import logging

def setup_clickhouse_db():
    try:
        app = create_app()
        with app.app_context():
            database_name = "ClickHouse Logs"
            sqlalchemy_uri = "clickhousedb://default:password@clickhouse:8123/otel_logs"

            # Check if database already exists
            existing_database = db.session.query(Database).filter_by(database_name=database_name).first()

            if existing_database:
                print(f"Database '{database_name}' already exists")
                return

            # Create new database connection
            new_database = Database(
                database_name=database_name,
                sqlalchemy_uri=sqlalchemy_uri,
                expose_in_sqllab=True,
                allow_run_async=True,
                allow_dml=True,
                allow_file_upload=False,
                extra={
                    "engine_params": {
                        "connect_args": {
                            "verify": False,
                        }
                    },
                    "metadata_cache_timeout": 300,
                    "metadata_params": {},
                    "schemas_allowed": [],
                }
            )

            db.session.add(new_database)
            db.session.commit()
            print(f"Database '{database_name}' configured successfully!")

    except Exception as e:
        print(f"Error configuring database: {str(e)}")
        raise

if __name__ == "__main__":
    setup_clickhouse_db()
