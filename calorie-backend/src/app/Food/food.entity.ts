import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import Category from '../Category/category.entity'
import User from '../User/user.entity'

@Entity('foods')
export default class Food extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: number

	@Column()
	name: string

	@Column()
	calorie: number

	@Column()
	dateTime: string

	@Column()
	date: string

	@Column({ nullable: true })
	userId: number

	@Column({ nullable: true })
	categoryId: number

	@ManyToOne(() => User, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user: User

	@ManyToOne(() => Category, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
	category: Category
}
