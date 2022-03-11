import {
	BaseEntity,
	BeforeInsert,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import bcrypt from 'bcrypt'

@Entity('users')
export default class User extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number

	@Column()
	name: string

	@Column({ unique: true })
	email: string

	@Column({ select: false })
	password: string

	@Column({ default: false })
	admin: boolean

	@Column({ default: 2100 })
	dailyCalorieLimit: number

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10)
	}
}
