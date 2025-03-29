import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Event from './Event';

interface RSVPAttributes {
    id: number;
    userId: number;
    eventId: number;
    status: 'attending' | 'maybe' | 'declined';
    createdAt?: Date;
    updatedAt?: Date;
}

interface RSVPCreationAttributes extends Optional<RSVPAttributes, 'id'> { }

class RSVP extends Model<RSVPAttributes, RSVPCreationAttributes> implements RSVPAttributes {
    public id!: number;
    public userId!: number;
    public eventId!: number;
    public status!: 'attending' | 'maybe' | 'declined';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public Event?: Event;
}

RSVP.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'events',
                key: 'id',
            },
        },
        status: {
            type: DataTypes.ENUM('attending', 'maybe', 'declined'),
            allowNull: false,
            defaultValue: 'attending'
        },
    },
    {
        sequelize,
        tableName: 'rsvps',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'eventId'],
            },
        ],
    }
);

// Define associations
User.belongsToMany(Event, { through: RSVP, foreignKey: 'userId', as: 'attendingEvents' });
Event.belongsToMany(User, { through: RSVP, foreignKey: 'eventId', as: 'attendees' });

export default RSVP;